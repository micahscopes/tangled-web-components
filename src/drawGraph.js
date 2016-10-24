import {line,symbol,symbolTriangle as triangle} from 'd3-shape'
import {nearbyEdgePoints} from "./nearbyRectEdges.js"

export const drawEdge = (ctx,edge,thickness) => {
  var rect1 = edge.source.getBoundingClientRect();

  // ctx.beginPath()
  // ctx.fillStyle = "deeppink"
  // ctx.arc(rect1.left,rect1.top,4,0,2*Math.PI);
  // ctx.arc(rect1.left+rect1.width,rect1.top,4,0,2*Math.PI);
  // ctx.arc(rect1.left+rect1.width,rect1.top+rect1.height,4,0,2*Math.PI);
  // ctx.arc(rect1.left,rect1.top+rect1.height,4,0,2*Math.PI);
  // ctx.fill()
  // ctx.closePath()

  var rect2 = edge.target.getBoundingClientRect();
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

      ctx.save()
        ctx.rotate(-Math.PI/2)
        ctx.translate(0,7+markerBuffer)
        triangle.draw(ctx,10*size*size);
      ctx.restore()

      // ctx.moveTo(0,-size/2);
      ctx.rect(lineBuffer,-size/2,len-2*lineBuffer,size);
      ctx.translate(len,0);
      ctx.rotate(Math.PI/2);
      ctx.translate(0,7+markerBuffer);
      triangle.draw(ctx,10*size*size);
    ctx.restore();
    ctx.stroke();
    ctx.fill();
  ctx.closePath();

}
