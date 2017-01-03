const reattacher = Symbol()

export function detach(elem,timeout){
  timeout = timeout ? timeout : 200;
  setTimeout(function(){
    var rect = elem.getBoundingClientRect();
    var style = window.getComputedStyle(elem);
    var oldStyle = elem.style;
    // console.log(style);
    var currentPosition = { x: parseInt(rect.left)-parseInt(style.marginLeft),
                        y: parseInt(rect.top)-parseInt(style.marginTop) };

    setTimeout(function(){
      elem.style.position = "absolute";
      elem.style.top = currentPosition.y + 'px';
      elem.style.left = currentPosition.x + 'px';
    },timeout)

    elem[reattacher] = function (){
      elem.style = oldStyle
    }
  },50);
}

export function reattach(elem){
  elem[reattacher]();
}
