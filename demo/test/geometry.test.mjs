import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {roads} from '../src/fixtures.mjs';
import {openDatabase} from '../src/database.mjs';
import {pointOnRoad} from '../public/map-geometry.js';

test('Named roads contain real OSM junctions and keep separate carriageways',()=>{
  const coordinates=id=>roads.find(r=>r.id===id).geometry.coordinates;
  // Actual Nguyễn Trãi / Khuất Duy Tiến junction; old illustrative coordinates missed it.
  const junction=[105.8027891,20.9914954];
  for(const id of ['RD01','RD06','RD07'])assert.ok(coordinates(id).some(line=>line.some(p=>p[0]===junction[0]&&p[1]===junction[1])));
  // Vũ Trọng Phụng meets Nguyễn Trãi here, rather than the previous diagonal eastwards.
  assert.ok(coordinates('RD08').some(line=>line.some(p=>p[0]===105.8103759&&p[1]===20.996621)));
  for(const road of roads){
    assert.equal(road.geometry.type,'MultiLineString');
    assert.equal(road.geometry.coordinates.length,road.geometrySource.osmWayIds.length);
    assert.ok(road.geometry.coordinates.every(line=>line.length>=2&&line.every(([lng,lat])=>lng>105.75&&lng<105.83&&lat>20.95&&lat<21.02)));
  }
});

test('Marker midpoint follows bends and does not fall between disconnected ways',()=>{
  assert.deepEqual(pointOnRoad({type:'MultiLineString',coordinates:[[[0,0],[2,0],[2,2]],[[10,10],[10,10.1]]]}),[2,0]);
  assert.deepEqual(pointOnRoad({type:'LineString',coordinates:[[0,0],[2,0]]}),[1,0]);
  assert.deepEqual(pointOnRoad({type:'LineString',coordinates:[[1,1],[1,1]]}),[1,1]);
  assert.equal(pointOnRoad({type:'MultiLineString',coordinates:[]}),null);
});

test('Opening a previously seeded database upgrades geometry and preserves user data',()=>{
  const directory=mkdtempSync(join(tmpdir(),'traffic-geometry-')),path=join(directory,'demo.sqlite');
  let db;
  try{
    db=openDatabase(path);
    const oldRoad={...roads[0],referenceSpeed:55,geometry:{type:'LineString',coordinates:[[105.7907,20.9811],[105.8188,21.0057]]}};
    delete oldRoad.geometrySource;
    db.prepare('UPDATE roads SET data=? WHERE id=?').run(JSON.stringify(oldRoad),'RD01');
    const sample={roadId:'RD01',period:'0800',speed:23,source:'CUSTOM-SIM'};
    db.prepare('UPDATE observations SET data=? WHERE road_id=? AND period=?').run(JSON.stringify(sample),'RD01','0800');
    db.prepare("UPDATE users SET name='Custom viewer' WHERE username='demo'").run();
    db.close();db=openDatabase(path);
    const updated=JSON.parse(db.prepare("SELECT data FROM roads WHERE id='RD01'").get().data);
    assert.deepEqual(updated.geometry,roads[0].geometry);
    assert.equal(updated.referenceSpeed,55);
    assert.deepEqual(JSON.parse(db.prepare("SELECT data FROM observations WHERE road_id='RD01' AND period='0800'").get().data),sample);
    assert.equal(db.prepare("SELECT name FROM users WHERE username='demo'").get().name,'Custom viewer');
    db.close();db=openDatabase(path);
    assert.deepEqual(JSON.parse(db.prepare("SELECT data FROM roads WHERE id='RD01'").get().data),updated);
  }finally{db?.close();rmSync(directory,{recursive:true,force:true});}
});
