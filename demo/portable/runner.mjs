import {createApp} from '../server.mjs';
import {writeFileSync,renameSync} from 'node:fs';
import {join} from 'node:path';

const [dataDirectory,token,revision]=process.argv.slice(2);
if(!dataDirectory||!token||!revision)throw new Error('Missing portable launcher configuration.');
const app=createApp({dbPath:join(dataDirectory,'demo.sqlite')});
// Identify this instance before the application's request handler runs.
app.server.prependListener('request',(_req,res)=>res.setHeader('X-Nhom8-Instance',token));
app.server.listen(0,'127.0.0.1',()=>{
  const url='http://127.0.0.1:'+app.server.address().port+'/';
  const temporary=join(dataDirectory,'ready.tmp');
  writeFileSync(temporary,[url,token,String(process.pid),revision].join('\n'),'utf8');
  renameSync(temporary,join(dataDirectory,'ready.txt'));
});
process.on('SIGTERM',()=>app.close().then(()=>process.exit()));
process.on('SIGINT',()=>app.close().then(()=>process.exit()));
