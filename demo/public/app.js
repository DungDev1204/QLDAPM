const $=id=>document.getElementById(id);
const colors={free:'#129d82',busy:'#e4a126',congested:'#e66370',stale:'#78869c',insufficient:'#9276be',unobserved:'#b5bec8'};
const state={user:null,csrf:null,meta:null,data:null,selected:null,map:null,view:'map',request:0,abort:null,tiles:null,tileTimer:null};
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=v=>v?new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(v)):'—';
const date=v=>new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v));
const usable=p=>p.sample&&!['stale','insufficient','unobserved'].includes(p.status);
const speed=p=>usable(p)?p.sample.speed:'—';
const vehicles=p=>usable(p)?p.sample.vehicles:'—';
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>$('toast').hidden=true,4000);}
async function api(path,options={}){
  const res=await fetch(path,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...options.headers}});
  const data=await res.json();
  if(!res.ok){
    if(res.status===401&&path!=='/api/login'&&state.user){showLogin('Phiên đã hết hạn. Vui lòng đăng nhập lại.');}
    const error=new Error(data.error||'Không thể tải dữ liệu.');error.status=res.status;throw error;
  }
  return data;
}
function showLogin(message=''){
  state.request++;state.abort?.abort();state.user=null;state.csrf=null;state.data=null;state.selected=null;
  $('app-page').hidden=true;$('login-page').hidden=false;$('password').value='';
  $('login-error').textContent=message;$('login-error').hidden=!message;
  if(state.map){state.map.remove();state.map=null;}clearTimeout(state.tileTimer);state.tiles=null;
  $('username').focus();
}
async function showApp(session){
  state.user=session.user;state.csrf=session.csrf;
  $('login-page').hidden=true;$('app-page').hidden=false;
  $('user-name').textContent=session.user.name;$('user-role').textContent=({viewer:'Người xem bản đồ',operator:'Người vận hành',manager:'Người quản lý'})[session.user.role];
  try{
    state.meta=await api('/api/meta');
    $('period').innerHTML=state.meta.periods.map(p=>`<option value="${p.id}">${escapeHtml(p.label)}</option>`).join('');
    $('status').innerHTML='<option value="all">Tất cả trạng thái</option>'+Object.entries(state.meta.statusLabels).map(([id,label])=>`<option value="${id}">${label}</option>`).join('');
    try{const saved=JSON.parse(localStorage.getItem('traffic-filters')||'null');if(saved){if(state.meta.periods.some(p=>p.id===saved.period))$('period').value=saved.period;if(saved.status==='all'||saved.status in state.meta.statusLabels)$('status').value=saved.status;$('search').value=String(saved.q||'').slice(0,100);}}catch{}
    $('osm-layer').checked=false;initMap();await loadTraffic();
  }catch(error){if(state.user)showNotice('Không thể mở dữ liệu: '+error.message+' Hãy thử Tải lại dữ liệu.',true);}
}
function showNotice(message,failure=false){$('notice').textContent=message;$('notice').hidden=!message;$('notice').classList.toggle('failure',failure);}
function initMap(){
  if(state.map)return;
  state.map=L.map('map',{zoomControl:false,minZoom:12,maxZoom:17,attributionControl:true}).setView([20.983,105.788],13);
  L.control.zoom({position:'topright'}).addTo(state.map);
  state.map.attributionControl.addAttribution('Nhóm 8 · Hình học mô phỏng');
  state.map.createPane('context');state.map.getPane('context').style.zIndex=250;
  state.map.createPane('reference');state.map.getPane('reference').style.zIndex=350;
  state.reference=L.layerGroup().addTo(state.map);state.traffic=L.layerGroup().addTo(state.map);state.stations=L.layerGroup().addTo(state.map);state.labels=L.layerGroup().addTo(state.map);
  const areas=[[[20.956,105.766],[20.962,105.762],[20.967,105.770],[20.964,105.776]],[[20.988,105.760],[20.994,105.769],[20.990,105.776],[20.984,105.768]],[[20.998,105.812],[21.006,105.819],[21.010,105.813],[21.004,105.807]]];
  for(const coords of areas)L.polygon(coords,{pane:'context',fillColor:'#d7e6d8',fillOpacity:.85,stroke:false,interactive:false}).addTo(state.map);
  L.polygon([[20.9637,105.7843],[20.9667,105.7844],[20.9681,105.7880],[20.9651,105.7894]],{pane:'context',fillColor:'#bcdae4',fillOpacity:.8,color:'#a4ccd9',weight:1,interactive:false}).addTo(state.map);
  for(const [lat,lng,label] of [[20.959,105.772,'HÀ ĐÔNG'],[21.002,105.800,'THANH XUÂN'],[20.988,105.764,'NAM TỪ LIÊM']])L.marker([lat,lng],{pane:'context',interactive:false,icon:L.divIcon({className:'place-label',html:label,iconSize:[110,20]})}).addTo(state.map);
  for(const [lat,lng,label] of [[20.9807,105.787,'▣ PTIT'],[20.965,105.786,'Hồ Văn Quán']])L.marker([lat,lng],{interactive:false,icon:L.divIcon({className:'landmark-label',html:label,iconSize:[100,20]})}).addTo(state.map);
  state.map.on('click',()=>{});
  requestAnimationFrame(()=>state.map.invalidateSize());
}
async function loadTraffic(){
  if(!state.user)return;
  if(!state.meta){await showApp({user:state.user,csrf:state.csrf});return;}
  const request=++state.request;state.abort?.abort();state.abort=new AbortController();
  const filters={period:$('period').value,status:$('status').value,q:$('search').value.trim()};
  $('refresh').disabled=true;$('filter-form').querySelector('button[type=submit]').disabled=true;
  try{
    const data=await api('/api/traffic?'+new URLSearchParams(filters),{signal:state.abort.signal});
    if(request!==state.request||!state.user)return;
    state.data=data;
    try{localStorage.setItem('traffic-filters',JSON.stringify(filters));}catch{}
    if(!data.features.some(f=>f.properties.id===state.selected))state.selected=null;
    $('snapshot-label').textContent=`Ảnh chụp dữ liệu lúc ${time(data.period.at)} · ${date(data.period.at)} · Giờ Việt Nam`;
    showNotice(!data.hasObservations?`Không có dữ liệu quan trắc tại thời điểm đã chọn. Mốc có dữ liệu gần nhất trong bộ mẫu: ${time(data.lastAvailableAt)} ${date(data.lastAvailableAt)}. Bạn vẫn có thể xem hình học đoạn đường.`:'');
    renderStats();renderRoads();renderMap();renderTable();renderDetail();
    $('road-count').textContent=data.matched;$('result-count').textContent=`${data.matched} / ${data.total} đoạn đường`;
    $('map-empty').hidden=data.matched>0;$('map-empty').textContent='Không có đoạn đường phù hợp. Hãy đổi tên đường hoặc trạng thái lọc.';
  }catch(error){if(error.name!=='AbortError'&&state.user&&request===state.request){showNotice(`Không thể tải dữ liệu mới. ${state.data?'Đang giữ kết quả của lần tải trước. ':''}Kiểm tra kết nối và chọn Tải lại dữ liệu.`,true);}}
  finally{if(request===state.request){$('refresh').disabled=false;$('filter-form').querySelector('button[type=submit]').disabled=false;}}
}
function renderStats(){
  const d=state.data,s=d.summary;
  $('stats').innerHTML=[[d.total,'Đoạn đường trong vùng','⌁'],[s.free,'Thông thoáng','↗'],[s.congested,'Nguy cơ ùn tắc','!'],[s.stale+s.insufficient+s.unobserved,'Cần kiểm tra dữ liệu','◷']].map(([value,label,icon])=>`<div class="stat-card"><div><span class="stat-label">${label}</span><strong>${value.toString().padStart(2,'0')}</strong><small>đoạn</small></div><span class="stat-symbol" aria-hidden="true">${icon}</span></div>`).join('');
}
function badge(p){return `<span class="badge"><i class="dot ${p.status}"></i>${state.meta.statusLabels[p.status]}</span>`;}
function renderRoads(){
  $('road-list').innerHTML=state.data.features.length?state.data.features.map(({properties:p})=>`<button class="road-item ${p.id===state.selected?'selected':''}" data-road="${p.id}" aria-pressed="${p.id===state.selected}"><i class="dot ${p.status}"></i><span><strong>${escapeHtml(p.name)}</strong><small>${p.id} · ${state.meta.statusLabels[p.status]}</small></span><span class="chevron">›</span></button>`).join(''):'<p class="empty-copy">Không có đoạn đường phù hợp bộ lọc.</p>';
}
function renderMap(){
  if(!state.map)return;
  state.reference.clearLayers();state.traffic.clearLayers();state.stations.clearLayers();state.labels.clearLayers();
  for(const feature of state.data.features){
    const p=feature.properties,selected=p.id===state.selected;
    const base=L.geoJSON(feature,{pane:'reference',style:{color:'#fff',weight:selected?14:11,opacity:1}}).addTo(state.reference);
    const line=L.geoJSON(feature,{style:{color:$('traffic-layer').checked?colors[p.status]:'#91a3ad',weight:selected?7:5,opacity:.95,dashArray:['stale','insufficient','unobserved'].includes(p.status)&&$('traffic-layer').checked?'7 7':null}}).addTo(state.traffic);
    const tooltip=`<strong>${escapeHtml(p.name)}</strong><br>${state.meta.statusLabels[p.status]}`;
    line.bindTooltip(tooltip,{className:'road-tooltip',sticky:true});line.on('click',()=>selectRoad(p.id,false));base.on('click',()=>selectRoad(p.id,false));
    const coords=feature.geometry.coordinates,middle=coords[Math.floor(coords.length/2)];
    if($('station-layer').checked&&p.sample){L.circleMarker([middle[1],middle[0]],{radius:5,color:'#fff',weight:2,fillColor:'#355c76',fillOpacity:1}).bindTooltip(escapeHtml(p.sample.source),{className:'station-tooltip'}).on('click',()=>selectRoad(p.id,false)).addTo(state.stations);}
    if(selected){L.marker([middle[1],middle[0]],{interactive:false,icon:L.divIcon({className:'landmark-label',html:escapeHtml(p.name),iconSize:[100,20],iconAnchor:[-10,10]})}).addTo(state.labels);}
  }
}
function selectRoad(id,pan=true){
  state.selected=id;renderRoads();renderMap();renderTable();renderDetail();
  const f=state.data.features.find(f=>f.properties.id===id);
  if(f&&pan&&state.view==='map')state.map.fitBounds(L.geoJSON(f).getBounds(),{padding:[75,100],maxZoom:14,animate:true});
  if(innerWidth<=700)$('detail').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function renderTable(){
  $('traffic-table').innerHTML=state.data.features.map(({properties:p})=>`<tr class="${p.id===state.selected?'selected':''}"><td><button data-road="${p.id}">${escapeHtml(p.name)}<small>${p.id} · ${escapeHtml(p.area)}</small></button></td><td>${badge(p)}</td><td>${speed(p)} ${usable(p)?'km/h':''}</td><td>${vehicles(p)}</td><td>${time(p.sample?.observedAt)}</td></tr>`).join('');
  $('table-empty').hidden=state.data.features.length>0;
}
function renderDetail(){
  const f=state.data?.features.find(f=>f.properties.id===state.selected);
  if(!f){$('detail').innerHTML='<div class="detail-placeholder"><div class="placeholder-icon">⌁</div><h3>Khám phá đoạn đường</h3><p>Chọn một tuyến trên bản đồ hoặc danh sách để xem thông tin quan trắc.</p></div>';return;}
  const p=f.properties,s=p.sample;
  const messages={free:'Tỷ lệ tốc độ từ 0,6 trở lên. Cửa sổ có đủ số bản tin hợp lệ.',busy:'Tỷ lệ tốc độ từ 0,3 đến dưới 0,6. Cửa sổ có đủ số bản tin hợp lệ.',congested:'Tỷ lệ tốc độ dưới 0,3. Đây là phân mức của một cửa sổ quan trắc, chưa phải sự cố đã xác minh.',stale:'Bản tin gần nhất đã quá 120 giây so với thời điểm đang xem. Không dùng số liệu cũ để kết luận giao thông hiện tại.',insufficient:'Cửa sổ chưa có đủ 8/10 bản tin hợp lệ hoặc thiếu thông số tốc độ. Không thay dữ liệu thiếu bằng 0.',unobserved:'Không có bản ghi quan trắc tại thời điểm đang xem. Hình học đoạn đường vẫn có thể tra cứu.'};
  const ratio=usable(p)?(s.speed/p.referenceSpeed).toFixed(2):'—';
  $('detail').innerHTML=`<div class="detail-heading"><span class="eyebrow">CHI TIẾT ĐOẠN ĐƯỜNG</span><button id="close-detail" class="ghost" aria-label="Đóng chi tiết">×</button></div><h2>${escapeHtml(p.name)}</h2><p class="area">${p.id} · ${escapeHtml(p.area)}, Hà Nội</p>${badge(p)}<div class="detail-metrics"><div><span>Tốc độ trung bình</span><strong>${speed(p)}</strong><small>km/h</small></div><div><span>Số xe / 5 phút</span><strong>${vehicles(p)}</strong><small>xe</small></div></div><dl class="detail-data"><div><dt>Tốc độ tham chiếu</dt><dd>${p.referenceSpeed} km/h</dd></div><div><dt>Tỷ lệ tốc độ</dt><dd>${ratio}</dd></div><div><dt>Bản tin hợp lệ</dt><dd>${s?`${s.valid} / ${s.expected}`:'—'}</dd></div><div><dt>Nguồn dữ liệu</dt><dd>${s?escapeHtml(s.source):'Chưa có'}</dd></div><div><dt>Quan trắc lúc</dt><dd>${time(s?.observedAt)}${s?`<br>${date(s.observedAt)}`:''}</dd></div><div><dt>Hệ thống nhận lúc</dt><dd>${time(s?.receivedAt)}${s?`<br>${date(s.receivedAt)}`:''}</dd></div></dl><div class="quality-box ${usable(p)?'':'warning'}"><strong>${usable(p)?'Thông tin quan trắc':'Chất lượng dữ liệu'}</strong>${messages[p.status]}</div><p class="detail-foot">Số liệu mô phỏng theo cửa sổ 5 phút. Độ mới được đối chiếu với mốc thời gian đã chọn.</p>`;
  $('close-detail').onclick=()=>{state.selected=null;renderRoads();renderMap();renderTable();renderDetail();};
}
function setView(view){state.view=view;$('map-container').hidden=view!=='map';$('table-container').hidden=view!=='table';for(const type of ['map','table']){$(`${type}-view`).classList.toggle('active',view===type);$(`${type}-view`).setAttribute('aria-pressed',String(view===type));}$('fit-map').hidden=view!=='map';if(view==='map')requestAnimationFrame(()=>state.map?.invalidateSize());}
function disableTiles(message){
  if(state.tiles){state.map?.removeLayer(state.tiles);state.tiles=null;}
  clearTimeout(state.tileTimer);$('osm-layer').checked=false;$('basemap-message').textContent=message;
}
function toggleTiles(){
  if(!$('osm-layer').checked){disableTiles('Nền mô phỏng · Dùng được khi không có Internet');return;}
  let errors=0;
  $('basemap-message').textContent='Đang tải nền OpenStreetMap…';
  state.tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(state.map);
  state.tiles.on('tileerror',()=>{if(++errors>=3)disableTiles('Không tải được nền trực tuyến. Đã chuyển về nền mô phỏng; các đoạn đường vẫn tra cứu được.');});
  state.tiles.on('tileload',()=>{clearTimeout(state.tileTimer);if(state.tiles)$('basemap-message').textContent='Nền OpenStreetMap · Lớp giao thông vẫn là dữ liệu mô phỏng';});
  state.tileTimer=setTimeout(()=>disableTiles('Kết nối nền bản đồ quá chậm. Đã chuyển về nền mô phỏng.'),8000);
}
$('login-form').onsubmit=async event=>{
  event.preventDefault();const button=event.currentTarget.querySelector('button[type=submit]');button.disabled=true;$('login-error').hidden=true;
  try{const session=await api('/api/login',{method:'POST',body:JSON.stringify({username:$('username').value,password:$('password').value})});$('password').value='';await showApp(session);}
  catch(error){$('login-error').textContent=error.status?error.message:'Không kết nối được máy chủ. Hãy kiểm tra ứng dụng đã chạy.';$('login-error').hidden=false;}
  finally{button.disabled=false;}
};
$('fill-demo').onclick=()=>{$('username').value='demo';$('password').value='Demo@123';$('login-error').hidden=true;};
$('show-password').onclick=()=>{const reveal=$('password').type==='password';$('password').type=reveal?'text':'password';$('show-password').textContent=reveal?'Ẩn':'Hiện';$('show-password').setAttribute('aria-label',reveal?'Ẩn mật khẩu':'Hiện mật khẩu');};
$('logout').onclick=async()=>{try{await api('/api/logout',{method:'POST',headers:{'X-CSRF-Token':state.csrf},body:'{}'});showLogin();toast('Đã đăng xuất và hủy phiên.');}catch(error){if(state.user)toast('Chưa đăng xuất được. Hãy kiểm tra kết nối và thử lại.');}};
$('filter-form').onsubmit=event=>{event.preventDefault();loadTraffic();};
$('reset').onclick=()=>{$('search').value='';$('status').value='all';$('period').value='0800';loadTraffic();};
$('refresh').onclick=()=>loadTraffic();
$('road-list').onclick=event=>{const button=event.target.closest('[data-road]');if(button)selectRoad(button.dataset.road);};
$('traffic-table').onclick=event=>{const button=event.target.closest('[data-road]');if(button)selectRoad(button.dataset.road);};
$('map-view').onclick=()=>setView('map');$('table-view').onclick=()=>setView('table');
$('fit-map').onclick=()=>{if(state.data?.features.length)state.map.fitBounds(L.geoJSON(state.data.features).getBounds(),{padding:[40,60],maxZoom:13});};
$('traffic-layer').onchange=()=>{if(state.data)renderMap();};$('station-layer').onchange=()=>{if(state.data)renderMap();};$('osm-layer').onchange=toggleTiles;
api('/api/session').then(showApp).catch(error=>{if(error.status!==401){$('login-error').hidden=false;$('login-error').textContent='Không kết nối được máy chủ. Hãy kiểm tra ứng dụng đã chạy.';}});
