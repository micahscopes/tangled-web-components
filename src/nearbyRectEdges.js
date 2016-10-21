import Vec from 'victor'

const X = Vec(1,0)
const P = 100
// Maybe a more efficient way, but messier to me.


function center(R){
  return new Vec(R.left+R.width/2, R.top+R.height/2)
}
function rad(R){
  return new Vec(R.width/2,R.height/2)
}

// This implementation is based on the L-p unit disk being a square as p -> inf
// pRad is the radius of the p-norm unit circle at angle theta, stretched by
// the ratio of 'rectangular radii', see here: https://www.desmos.com/calculator/hzrmdr9j6w
var pRad = (theta,p,rW,rH) => Math.pow(Math.pow((rH/rW)*Math.cos(theta),p) +
                                  Math.pow(Math.sin(theta),p), -1/p)
// pXY is the cartesian coordinates of the point on the p-norm unit "circle" at angle theta.
// the dimensions are unstretched, somehow only using the longer rectangle-radius is necessary (?)
var pXY = (theta,p,rW,rH) => new Vec(rH*Math.cos(theta)*pRad(theta,p,rW,rH),rH*Math.sin(theta)*pRad(theta,p,rW,rH))

export function nearbyEdgePoints(r1,r2,p1,p2,phase,margin){
  phase = phase ? phase : Math.PI/16;
  margin = margin ? margin : 0;
  if (p1 == undefined){p1 = P}
  if (p2 == undefined){p2 = P}
  var c1 = center(r1), c2 = center(r2);
  var rad1 = rad(r1), rad2 = rad(r2);
  var phi = c2.clone().subtract(c1.clone()).angle()
  var edgePt1 = pXY(phi+phase,p1,rad1.x+margin,rad1.y+margin);
  var edgePt2 = pXY(phi-phase+Math.PI,p2,rad2.x+margin,rad2.y+margin) //new Vec(-edgePt1.x, -edgePt1.y);//.multiplyX(rad1).multiplyY(rad1);
  return([c1.clone().add(edgePt1),
          c2.clone().add(edgePt2)
        ])
}


// For some reason this implementation isn't working:
// var abs = Math.abs
// var mod = (n, m) => ((n.toFixed(3) % m) + m) % m;
// var saw = (x,m) => (2/m)*(m/2-abs(mod(x,m*2))-m)
// function clamp(num, low, high) {
//   return Math.max(Math.min(num,high),low);
// }
//
// var clampedSaw = (x) => -2*clamp(saw(x,Math.PI),-1/2,1/2)
// var square = (phi) => new Vec(clampedSaw(phi),clampedSaw(phi-Math.PI/2))
//
//
// export function nearbyEdgePoints(r1,r2){
//   var c1 = center(r1), c2 = center(r2);
//   var rad1 = rad(r1), rad2 = rad(r2);
//   var phi = c2.clone().subtract(c1.clone()).angle()
//   var edgePt1 = square(phi,P);
//   var edgePt2 = new Vec(-edgePt1.x, -edgePt1.y);//.multiplyX(rad1).multiplyY(rad1);
//   return([c1.clone().add(edgePt1.multiply(rad1)),
//           c2.clone().add(edgePt2.multiply(rad2))
//         ])
// }
