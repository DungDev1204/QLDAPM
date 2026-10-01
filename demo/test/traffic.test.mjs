import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.mjs';
import {classify,periods} from '../src/fixtures.mjs';
let app,url,cookie,csrf;
before(async()=>{app=createApp({dbPath:':memory:'});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${app.server.address().port}`;});
after(async()=>{await app.close();});
const request=(path,options={})=>fetch(url+path,{...options,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...options.headers}});
async function login(username='demo',password='Demo@123'){
  const res=await request('/api/login',{method:'POST',body:JSON.stringify({username,password})});
  if(res.ok){cookie=res.headers.get('set-cookie').split(';')[0];csrf=(await res.json()).csrf;}
  return res;
}
test('API requires authentication and static server blocks source/database access',async()=>{
  assert.equal((await request('/api/traffic')).status,401);
  for(const path of ['/server.mjs','/data/demo.sqlite','/src/fixtures.mjs'])assert.equal((await request(path)).status,404);
});
test('Wrong password and locked account are rejected; password is hashed',async()=>{
  assert.equal((await login('demo','bad')).status,401);
  assert.equal((await login('bikhoa')).status,401);
  const row=app.db.prepare("SELECT hash FROM users WHERE username='demo'").get();assert.notEqual(row.hash,'Demo@123');assert.equal(row.hash.length,128);
});
test('Login creates HttpOnly SameSite session; traffic returns 10 GeoJSON roads',async()=>{
  const res=await login();assert.equal(res.status,200);assert.match(res.headers.get('set-cookie'),/HttpOnly/);assert.match(res.headers.get('set-cookie'),/SameSite=Strict/);
  const data=await (await request('/api/traffic')).json();assert.equal(data.features.length,10);
  assert.deepEqual(data.summary,{free:4,busy:1,congested:2,stale:1,insufficient:1,unobserved:1});
  assert.equal(data.features[0].geometry.type,'MultiLineString');assert.equal(data.features[0].properties.name,'Nguyễn Trãi');
  const me=await (await request('/api/session')).json();assert.equal(me.user.username,'demo');assert.equal(me.user.hash,undefined);
});
test('Server applies case/accent-insensitive name, status, and period filters',async()=>{
  const found=await (await request('/api/traffic?q=nguyen%20trai&status=congested')).json();assert.equal(found.matched,1);assert.equal(found.features[0].properties.id,'RD01');
  const old=await (await request('/api/traffic?q=RD01&period=0750')).json();assert.equal(old.features[0].properties.status,'free');
  const none=await (await request('/api/traffic?q=notfound')).json();assert.equal(none.matched,0);
  assert.equal((await request('/api/traffic?period=wrong')).status,400);assert.equal((await request('/api/traffic?status=wrong')).status,400);
  assert.equal((await request('/api/traffic?status=toString')).status,400);
});
test('Missing period preserves geometry without substituting zero measurements',async()=>{
  const empty=await (await request('/api/traffic?period=empty')).json();assert.equal(empty.hasObservations,false);assert.equal(empty.features.length,10);
  assert.ok(empty.features.every(f=>f.properties.sample===null&&f.properties.status==='unobserved'));
  assert.equal(empty.lastAvailableAt,periods[0].at);
});
test('Threshold boundaries, stale >120 sec, and quality threshold 8/10',()=>{
  const sample={observedAt:periods[0].at,valid:8,expected:10,speed:30};
  assert.equal(classify(sample,50,periods[0].at),'free');
  assert.equal(classify({...sample,speed:15},50,periods[0].at),'busy');
  assert.equal(classify({...sample,speed:14.9},50,periods[0].at),'congested');
  assert.equal(classify({...sample,valid:7},50,periods[0].at),'insufficient');
  assert.equal(classify({...sample,speed:null},50,periods[0].at),'insufficient');
  assert.equal(classify(sample,0,periods[0].at),'insufficient');
  assert.equal(classify(sample,50,new Date(Date.parse(sample.observedAt)+120000).toISOString()),'free');
  assert.equal(classify(sample,50,new Date(Date.parse(sample.observedAt)+121000).toISOString()),'stale');
});
test('Unexpected JSON types and cross-origin requests are rejected',async()=>{
  assert.equal((await request('/api/login',{method:'POST',body:JSON.stringify({username:{},password:123})})).status,400);
  assert.equal((await request('/api/login',{method:'POST',body:'null'})).status,400);
  assert.equal((await request('/api/traffic',{headers:{Origin:'https://foreign.example'}})).status,403);
});
test('Unsupported role gets 403 on traffic API',async()=>{
  app.db.prepare("UPDATE users SET role='restricted' WHERE username='demo'").run();
  assert.equal((await request('/api/traffic')).status,403);
  app.db.prepare("UPDATE users SET role='viewer' WHERE username='demo'").run();
});
test('Session expiration is enforced on server',async()=>{
  app.db.prepare('UPDATE sessions SET expires=0').run();assert.equal((await request('/api/traffic')).status,401);await login();
});
test('Logout checks CSRF, revokes old session and writes audit event',async()=>{
  assert.equal((await request('/api/logout',{method:'POST',body:'{}'})).status,403);
  assert.equal((await request('/api/logout',{method:'POST',headers:{'X-CSRF-Token':csrf},body:'{}'})).status,200);
  assert.equal((await request('/api/session')).status,401);assert.equal((await request('/api/traffic')).status,401);
  assert.ok(app.db.prepare("SELECT id FROM audit WHERE action='logout'").get());
});
