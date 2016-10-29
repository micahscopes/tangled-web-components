import {line,symbol,symbolTriangle as triangle} from 'd3-shape'
import {nearbyEdgePoints} from "./nearbyRectEdges.js"

export const rectCache = Symbol();
export const rectInViewport = Symbol();
// const skipFrames = 10;
// const skip = Symbol();
// const rectsEq = (r1,r2) => r1.top == r2.top && r1.bottom == r2.bottom && r1.left == r2.left && r1.right == r2.right
export const cacheBoundingRect =  (el) => {
  // if (el[skip] <= skipFrames) {
  //   el[skip] += 1
  //   return
  // }
  // var oldRect = el[rectCache]
  var rect = el[rectCache] = el.getBoundingClientRect()
  // if (rectsEq(rect, oldRect)) { el[skip] = 0};
  el[rectInViewport] = (
        rect.top >= 0 ||
        rect.left >= 0 ||
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) ||
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export const drawEdge = (ctx,edge,thickness) => {
  if ( edge.source[rectInViewport] || edge.target[rectInViewport] ) {
    var R1 = edge.source[rectCache];
    var R2 = edge.target[rectCache];
    var pts = nearbyEdgePoints(R1,R2,edge.source.round,edge.target.round,undefined,0)

    var size = thickness*1;
    const markerBuffer = 1 + 2*size;
    const lineBuffer = markerBuffer+3;
    // var fill = 'magenta'
    // var stroke = '#222'
    // var strokeWidth = 2

    // ctx.strokeStyle = "yellow";
    // ctx.fillStyle = "black";
    // ctx.lineWidth = 2;
    var diff = pts[1].clone().subtract(pts[0])
    var len = diff.length();

    ctx.beginPath()
      ctx.save()
        ctx.translate(pts[0].x,pts[0].y)
        ctx.rotate(Math.atan2(diff.y,diff.x));

        if(edge.direction <= 0){
          ctx.save()
            ctx.rotate(-Math.PI/2)
            ctx.translate(0,7+markerBuffer)
            triangle.draw(ctx,5*size*size+25);
          ctx.restore()
        }
        // ctx.moveTo(0,-size/2);
        ctx.rect(lineBuffer,-size/2,len-2*lineBuffer,size);
        if(edge.direction >= 0){
          ctx.translate(len,0);
          ctx.rotate(Math.PI/2);
          ctx.translate(0,7+markerBuffer);
          triangle.draw(ctx,5*size*size+25);
        }
      ctx.restore();
      ctx.stroke();
      ctx.fill();
    ctx.closePath();
  }
}
