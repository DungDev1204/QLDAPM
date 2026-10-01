// Import an Overpass `out geom` JSON snapshot. Run from any directory:
// node demo/scripts/import-road-geometries.mjs path/to/osm-source.json
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const input=process.argv[2];
if(!input)throw new Error('Provide an Overpass JSON snapshot with way geometry.');
const source=JSON.parse(readFileSync(input,'utf8'));
const definitions=[
  ['RD01','Nguyễn Trãi',['primary','trunk']],
  ['RD02','Trần Phú',['trunk']],
  ['RD03','Quang Trung',['trunk']],
  ['RD04','Tố Hữu',['primary']],
  ['RD05','Lê Văn Lương',['primary']],
  ['RD06','Khuất Duy Tiến',['primary','trunk']],
  ['RD07','Nguyễn Xiển',['primary','trunk']],
  ['RD08','Vũ Trọng Phụng',['tertiary']],
  ['RD09','Chiến Thắng',['tertiary']],
  ['RD10','Văn Quán',['residential']]
];
const snapshotAt=source.osm3s?.timestamp_osm_base;
if(!snapshotAt)throw new Error('Snapshot must include its OSM timestamp.');
const roads=Object.fromEntries(definitions.map(([id,name,classes])=>{
  // Exact names exclude alleys; highway classes exclude unrelated namesakes.
  const ways=source.elements.filter(w=>w.type==='way'&&
    w.tags?.name?.replace(/^(Đường|Phố) /,'')===name&&classes.includes(w.tags.highway)
  ).sort((a,b)=>a.id-b.id);
  if(!ways.length)throw new Error('No road geometry for '+id+' '+name);
  const coordinates=ways.map(w=>{
    if(!w.geometry||w.geometry.length<2||w.geometry.some(p=>!Number.isFinite(p.lon)||!Number.isFinite(p.lat)))throw new Error('Invalid geometry for way '+w.id);
    return w.geometry.map(p=>[p.lon,p.lat]);
  });
  // Never concatenate disconnected ways: this would draw lines across buildings.
  return [id,{geometry:{type:'MultiLineString',coordinates},osmWayIds:ways.map(w=>w.id)}];
}));
const result={source:'OpenStreetMap',license:'ODbL-1.0',attribution:'© OpenStreetMap contributors',
  sourceUrl:'https://www.openstreetmap.org/copyright',snapshotAt,
  revision:'osm-'+snapshotAt,queryBounds:[105.76,20.95,105.825,21.015],roads};
writeFileSync(fileURLToPath(new URL('../src/road-geometries.json',import.meta.url)),JSON.stringify(result,null,2)+'\n');
console.log('Imported '+Object.keys(roads).length+' roads from OSM '+snapshotAt);
