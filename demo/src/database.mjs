import {DatabaseSync} from 'node:sqlite';
import {scryptSync,randomBytes} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {roads,samples} from './fixtures.mjs';

export function openDatabase(path){
  if(path!==':memory:')mkdirSync(dirname(path),{recursive:true});
  const db=new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, name TEXT, role TEXT, salt TEXT, hash TEXT, locked INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER, csrf TEXT, expires INTEGER);
    CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, user_id INTEGER, action TEXT, occurred_at TEXT);
    CREATE TABLE IF NOT EXISTS roads (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS observations (road_id TEXT, period TEXT, data TEXT NOT NULL, PRIMARY KEY(road_id,period));`);
  if(!db.prepare('SELECT id FROM users LIMIT 1').get()){
    const users=[['demo','Người xem bản đồ','viewer',0],['vanhanh','Nguyễn Minh Anh','operator',0],['quanly','Quản lý giao thông','manager',0],['bikhoa','Tài khoản bị khóa','viewer',1]];
    for(const [username,name,role,locked] of users){
      const salt=randomBytes(16).toString('hex');
      db.prepare('INSERT INTO users(username,name,role,salt,hash,locked) VALUES(?,?,?,?,?,?)').run(username,name,role,salt,scryptSync('Demo@123',salt,64).toString('hex'),locked);
    }
  }
  const insertRoad=db.prepare('INSERT OR IGNORE INTO roads VALUES(?,?)');
  const findRoad=db.prepare('SELECT data FROM roads WHERE id=?');
  const updateGeometry=db.prepare('UPDATE roads SET data=? WHERE id=?');
  for(const road of roads){
    insertRoad.run(road.id,JSON.stringify(road));
    const existing=JSON.parse(findRoad.get(road.id).data);
    if(existing.geometrySource?.revision!==road.geometrySource.revision){
      // Upgrade already-seeded databases without changing observations or road metadata.
      updateGeometry.run(JSON.stringify({...existing,geometry:road.geometry,geometrySource:road.geometrySource}),road.id);
    }
  }
  const insertSample=db.prepare('INSERT OR IGNORE INTO observations VALUES(?,?,?)');
  for(const sample of samples())insertSample.run(sample.roadId,sample.period,JSON.stringify(sample));
  return db;
}
