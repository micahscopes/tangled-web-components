import Kefir from 'kefir';

function eventsPositionDiff(prevEvent, nextEvent) {
  //console.log(prevEvent,nextEvent);
    if(nextEvent.touches) {
        nextEvent = nextEvent.touches[0];
    } 
    if(prevEvent.touches) {
        prevEvent = prevEvent.touches[0];
    }
  return {
    x: nextEvent.clientX - prevEvent.clientX,
    y: nextEvent.clientY - prevEvent.clientY
  };
}

function applyMove(currentPosition, move) {
  //console.log(move);
  return {
    x: currentPosition.x + move.x,
    y: currentPosition.y + move.y
  };
}
const preventDefault = (event) => { event.preventDefault(); }
const drag = Symbol()

export function startDragging(elem,timeout){
  timeout = timeout ? timeout : 200;
  setTimeout(function(){
    // console.log(elem.style.left,elem.style.top)
    elem.style.cursor = 'move'
    elem.style.userSelect = 'none'

    var drag = function(pos) {
      elem.style.top = pos.y + 'px';
      elem.style.left = pos.x + 'px';
    }

    var mouseUps = Kefir.fromEvents(document, 'mouseup').merge(Kefir.fromEvents(document,'touchend'));
    var mouseMoves = Kefir.fromEvents(document, 'mousemove').merge(Kefir.fromEvents(document,'touchmove'));
    var mouseDowns = Kefir.fromEvents(elem, 'mousedown').merge(Kefir.fromEvents(elem,'touchstart'));
    mouseDowns.onValue( preventDefault );

    var moves = mouseDowns.flatMap(function(downEvent) {
      return mouseMoves.takeUntilBy(mouseUps)
        .diff(eventsPositionDiff, downEvent);
    });
    var rect = elem.getBoundingClientRect();
    var style = window.getComputedStyle(elem);
    // console.log(style);
    var currentPosition = { x: parseInt(rect.left)-parseInt(style.marginLeft),
                        y: parseInt(rect.top)-parseInt(style.marginTop) };
                        // console.log(currentPosition);
    var position = moves.scan(applyMove, currentPosition);

    setTimeout(function(){
      elem.style.position = "absolute";
      position.onValue(drag);
    },timeout)

    elem[stopDragging] = function (){
      elem.style.cursor = 'default'
      elem.style.userSelect = 'default'
      position.offValue(drag);
      mouseDowns.offValue( preventDefault );
    }
  },50);
}

export function stopDragging(elem){
  elem[stopDragging]();
}

export const draggableHostStyle = `:host {
  cursor: move;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
}`
