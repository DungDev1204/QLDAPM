export const periods = [
  { id: '0800', label: '08:00 · 30/09/2026', at: '2026-09-30T01:00:00.000Z' },
  { id: '0755', label: '07:55 · 30/09/2026', at: '2026-09-30T00:55:00.000Z' },
  { id: '0750', label: '07:50 · 30/09/2026', at: '2026-09-30T00:50:00.000Z' },
  { id: 'empty', label: '08:00 · 29/09/2026 — chưa có dữ liệu', at: '2026-09-29T01:00:00.000Z' }
];
// Geometry is simplified and illustrative, not surveyed road boundaries.
export const roads = [
  ['RD01','Nguyễn Trãi','Thanh Xuân',50,[[105.7907,20.9811],[105.7968,20.9860],[105.8036,20.9931],[105.8114,21.0002],[105.8188,21.0057]]],
  ['RD02','Trần Phú','Hà Đông',50,[[105.7749,20.9666],[105.7804,20.9713],[105.7857,20.9762],[105.7907,20.9811]]],
  ['RD03','Quang Trung','Hà Đông',40,[[105.7604,20.9501],[105.7654,20.9568],[105.7749,20.9666]]],
  ['RD04','Tố Hữu','Nam Từ Liêm',50,[[105.7567,20.9730],[105.7665,20.9816],[105.7759,20.9888],[105.7876,20.9985]]],
  ['RD05','Lê Văn Lương','Thanh Xuân',50,[[105.7876,20.9985],[105.7963,21.0042],[105.8053,21.0102]]],
  ['RD06','Khuất Duy Tiến','Thanh Xuân',50,[[105.7813,21.0072],[105.7876,20.9985],[105.7968,20.9860],[105.8024,20.9789]]],
  ['RD07','Nguyễn Xiển','Thanh Xuân',50,[[105.7968,20.9860],[105.8038,20.9784],[105.8082,20.9686]]],
  ['RD08','Vũ Trọng Phụng','Thanh Xuân',40,[[105.8036,20.9931],[105.8085,20.9983],[105.8138,21.0035]]],
  ['RD09','Chiến Thắng','Hà Đông',40,[[105.7857,20.9762],[105.7929,20.9709],[105.8000,20.9668]]],
  ['RD10','Văn Quán','Hà Đông',40,[[105.7804,20.9713],[105.7865,20.9665],[105.7929,20.9709]]]
].map(([id,name,area,referenceSpeed,coordinates])=>({id,name,area,referenceSpeed,geometry:{type:'LineString',coordinates}}));

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
