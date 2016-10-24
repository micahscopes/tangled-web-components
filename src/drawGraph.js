import {line,symbol,symbolTriangle as triangle} from 'd3-shape'
import {nearbyEdgePoints} from "./nearbyRectEdges.js"

export const rectCache = Symbol();
export const cacheBoundingRect = (el) => el[rectCache] = el.getBoundingClientRect()

export const drawEdge = (ctx,edge,thickness) => {
  var rect1 = edge.source[rectCache];
  var rect2 = edge.target[rectCache];
  var pts = nearbyEdgePoints(rect1,rect2,edge.source.round,edge.target.round,undefined,0)

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
