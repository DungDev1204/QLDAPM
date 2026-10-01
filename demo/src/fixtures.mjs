import roadGeometries from './road-geometries.json' with {type:'json'};

export const periods = [
  { id: '0800', label: '08:00 · 30/09/2026', at: '2026-09-30T01:00:00.000Z' },
  { id: '0755', label: '07:55 · 30/09/2026', at: '2026-09-30T00:55:00.000Z' },
  { id: '0750', label: '07:50 · 30/09/2026', at: '2026-09-30T00:50:00.000Z' },
  { id: 'empty', label: '08:00 · 29/09/2026 — chưa có dữ liệu', at: '2026-09-29T01:00:00.000Z' }
];
// Road geometry is a bundled OSM snapshot; only traffic observations are simulated.
export const roads = [
  ['RD01','Nguyễn Trãi','Thanh Xuân',50],
  ['RD02','Trần Phú','Hà Đông',50],
  ['RD03','Quang Trung','Hà Đông',40],
  ['RD04','Tố Hữu','Nam Từ Liêm',50],
  ['RD05','Lê Văn Lương','Thanh Xuân',50],
  ['RD06','Khuất Duy Tiến','Thanh Xuân',50],
  ['RD07','Nguyễn Xiển','Thanh Xuân',50],
  ['RD08','Vũ Trọng Phụng','Thanh Xuân',40],
  ['RD09','Chiến Thắng','Hà Đông',40],
  ['RD10','Văn Quán','Hà Đông',40]
].map(([id,name,area,referenceSpeed])=>({id,name,area,referenceSpeed,
  geometry:roadGeometries.roads[id].geometry,
  geometrySource:{name:roadGeometries.source,revision:roadGeometries.revision,
    snapshotAt:roadGeometries.snapshotAt,osmWayIds:roadGeometries.roads[id].osmWayIds}
}));

export function samples() {
  const speeds=[[12,36,28,9,39,18,32,null,22,null],[17,35,30,16,41,21,35,null,27,null],[34,40,32,31,42,29,37,null,30,null]];
  return periods.slice(0,3).flatMap((period,p)=>roads.filter(r=>r.id!=='RD10').map((road,i)=>{
    const at=Date.parse(period.at), stale=i===7;
    return {roadId:road.id,period:period.id,speed:speeds[p][i],vehicles:35+(i*17+p*9)%115,
      valid:i===8?5:10,expected:10,observedAt:new Date(at-(stale?480:30)*1000).toISOString(),
      receivedAt:new Date(at-(stale?475:25)*1000).toISOString(),source:`SIM-IOT-${String(i+1).padStart(2,'0')}`};
  }));
}

export const statusLabels={free:'Thông thoáng',busy:'Đông',congested:'Nguy cơ ùn tắc',stale:'Mất cập nhật',insufficient:'Thiếu dữ liệu',unobserved:'Chưa quan trắc'};

export function classify(sample,referenceSpeed,asOf){
  if(!sample)return 'unobserved';
  if(Date.parse(asOf)-Date.parse(sample.observedAt)>120000)return 'stale';
  if(sample.valid/sample.expected<0.8||sample.speed===null||referenceSpeed<=0)return 'insufficient';
  const ratio=sample.speed/referenceSpeed;
  return ratio>=0.6?'free':ratio>=0.3?'busy':'congested';
}
