// Return a point on the longest component, never in a gap between OSM ways.
// Coordinates use GeoJSON order: [longitude, latitude].
export function pointOnRoad(geometry){
  const lines=geometry.type==='MultiLineString'?geometry.coordinates:[geometry.coordinates];
  const distance=(a,b)=>Math.hypot((b[0]-a[0])*Math.cos((a[1]+b[1])*Math.PI/360),b[1]-a[1]);
  let longest=null,total=-1;
  for(const line of lines){
    const length=line.slice(1).reduce((sum,p,i)=>sum+distance(line[i],p),0);
    if(length>total){longest=line;total=length;}
  }
  if(!longest?.length)return null;
  let remaining=total/2;
  for(let i=1;i<longest.length;i++){
    const a=longest[i-1],b=longest[i],length=distance(a,b);
    if(length>0&&remaining<=length){const t=remaining/length;return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
    remaining-=length;
  }
  return longest[0];
}
