import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve,extname,sep} from 'node:path';
import {randomBytes,createHash,scryptSync,timingSafeEqual} from 'node:crypto';
import {openDatabase} from './src/database.mjs';
import {classify,periods,statusLabels} from './src/fixtures.mjs';

const root=dirname(fileURLToPath(import.meta.url));
const digest=value=>createHash('sha256').update(value).digest('hex');
const safeUser=u=>({id:u.id,name:u.name,username:u.username,role:u.role});
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function body(req){
  if(!req.headers['content-type']?.startsWith('application/json'))throw {status:415,message:'Yêu cầu dữ liệu JSON.'};
  let value='';for await(const chunk of req){value+=chunk;if(value.length>8192)throw {status:413,message:'Dữ liệu quá lớn.'};}
  try{return JSON.parse(value);}catch{throw {status:400,message:'Dữ liệu không hợp lệ.'};}
}

export function createApp({dbPath=resolve(root,'data/demo.sqlite'),sessionMs=30*60*1000}={}){
  const db=openDatabase(dbPath), attempts=new Map();
  const audit=(id,action)=>db.prepare('INSERT INTO audit(user_id,action,occurred_at) VALUES(?,?,?)').run(id,action,new Date().toISOString());
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://tile.openstreetmap.org; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    try{
      const url=new URL(req.url,'http://localhost');
      if(url.pathname.startsWith('/api/')){
        if(req.headers.origin && req.headers.origin!==`http://${req.headers.host}` && req.headers.origin!==`https://${req.headers.host}`)return json(res,403,{error:'Nguồn yêu cầu không hợp lệ.'});
        if(req.method==='POST'&&url.pathname==='/api/login'){
          const payload=await body(req);
          if(!payload||typeof payload.username!=='string'||typeof payload.password!=='string'||payload.username.length>64||payload.password.length>128)return json(res,400,{error:'Thông tin đăng nhập không hợp lệ.'});
          const key=req.socket.remoteAddress, now=Date.now();
          let limit=attempts.get(key);
          if(!limit||now-limit.start>60000){limit={start:now,count:0};attempts.set(key,limit);}
          if(++limit.count>15)return json(res,429,{error:'Bạn thử quá nhiều lần. Vui lòng thử lại sau một phút.'});
          const u=db.prepare('SELECT * FROM users WHERE username=?').get(payload.username.trim());
          const check=scryptSync(payload.password,u?.salt??'nonexistent-demo-salt',64);
          if(!u||!timingSafeEqual(check,Buffer.from(u.hash,'hex'))||u.locked)return json(res,401,{error:'Tên đăng nhập hoặc mật khẩu không đúng, hoặc tài khoản đã bị khóa.'});
          attempts.delete(key);
          const token=randomBytes(32).toString('hex'), csrf=randomBytes(24).toString('hex');
          // Rotate the previous session when logging in again in the same browser.
          const previous=req.headers.cookie?.match(/(?:^|;\s*)sid=([a-f0-9]{64})(?:;|$)/)?.[1];
          if(previous)db.prepare('DELETE FROM sessions WHERE token=?').run(digest(previous));
          db.prepare('DELETE FROM sessions WHERE expires<=?').run(now);
          db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(digest(token),u.id,csrf,now+sessionMs);
          audit(u.id,'login');
          res.setHeader('Set-Cookie',`sid=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.ceil(sessionMs/1000)}${process.env.COOKIE_SECURE==='1'?'; Secure':''}`);
          return json(res,200,{user:safeUser(u),csrf});
        }
        const rawToken=req.headers.cookie?.match(/(?:^|;\s*)sid=([a-f0-9]{64})(?:;|$)/)?.[1];
        const token=rawToken?digest(rawToken):'';
        const session=db.prepare('SELECT * FROM sessions WHERE token=? AND expires>?').get(token,Date.now());
        const u=session?db.prepare('SELECT * FROM users WHERE id=? AND locked=0').get(session.user_id):null;
        if(!u)return json(res,401,{error:'Phiên đã hết hạn. Vui lòng đăng nhập lại.'});
        if(req.method==='POST'&&url.pathname==='/api/logout'){
          if(req.headers['x-csrf-token']!==session.csrf)return json(res,403,{error:'Yêu cầu đăng xuất không hợp lệ.'});
          db.prepare('DELETE FROM sessions WHERE token=?').run(token);audit(u.id,'logout');
          res.setHeader('Set-Cookie','sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
          return json(res,200,{ok:true});
        }
        if(req.method!=='GET')return json(res,405,{error:'Thao tác không được hỗ trợ.'});
        if(!['viewer','operator','manager'].includes(u.role))return json(res,403,{error:'Bạn không có quyền xem bản đồ.'});
        if(url.pathname==='/api/session')return json(res,200,{user:safeUser(u),csrf:session.csrf});
        if(url.pathname==='/api/meta')return json(res,200,{periods,statusLabels,simulated:true});
        if(url.pathname==='/api/traffic'){
          const period=periods.find(p=>p.id===(url.searchParams.get('period')||'0800'));
          const status=url.searchParams.get('status')||'all', q=(url.searchParams.get('q')||'').trim();
          if(!period||!(status==='all'||Object.hasOwn(statusLabels,status))||q.length>100)return json(res,400,{error:'Bộ lọc không hợp lệ.'});
          const normalize=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
          const all=db.prepare('SELECT data FROM roads ORDER BY id').all().map(row=>{
            const road=JSON.parse(row.data), sampleRow=db.prepare('SELECT data FROM observations WHERE road_id=? AND period=?').get(road.id,period.id);
            const sample=sampleRow?JSON.parse(sampleRow.data):null;
            return {...road,sample,status:classify(sample,road.referenceSpeed,period.at)};
          });
          const filtered=all.filter(r=>(status==='all'||r.status===status)&&normalize(`${r.name} ${r.id} ${r.area}`).includes(normalize(q)));
          return json(res,200,{period,simulated:true,total:all.length,matched:filtered.length,
            summary:Object.fromEntries(Object.keys(statusLabels).map(k=>[k,all.filter(r=>r.status===k).length])),
            features:filtered.map(r=>({type:'Feature',geometry:r.geometry,properties:{...r,geometry:undefined}})),
            hasObservations:all.some(r=>r.sample!==null),lastAvailableAt:periods[0].at});
        }
        return json(res,404,{error:'Không tìm thấy API.'});
      }
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
      let dir=resolve(root,'public'), pathname=decodeURIComponent(url.pathname);
      if(pathname.startsWith('/vendor/')){dir=resolve(root,'node_modules/leaflet/dist');pathname=pathname.slice('/vendor'.length);}
      if(pathname==='/')pathname='/index.html';
      const path=resolve(dir,'.'+pathname);
      if(!path.startsWith(dir+sep)){res.writeHead(403);return res.end();}
      const content=await readFile(path);
      const type={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'}[extname(path)]||'application/octet-stream';
      res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);
    }catch(err){
      if(err.code==='ENOENT'){res.writeHead(404);res.end('Not found');}
      else {if(!err.status)console.error(err);json(res,err.status||500,{error:err.message&&err.status?err.message:'Không thể xử lý yêu cầu. Vui lòng thử lại.'});}
    }
  });
  return {server,db,close:()=>new Promise((resolve,reject)=>{server.close(err=>{db.close();err?reject(err):resolve();});server.closeAllConnections();})};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const app=createApp();
  app.server.listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('Demo L01: http://localhost:'+(process.env.PORT||3000)));
}
