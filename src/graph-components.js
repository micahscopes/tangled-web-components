import {
  select,
  selectAll
} from "d3-selection";
import { line } from "d3-shape"
import cmb from "js-combinatorics"
import { define, h, prop } from 'skatejs';
import * as skate from 'skatejs';
const sym = Symbol();

var css=`
path {stroke: #0f0; stroke-width:4px; fill:none}
svg {
  width: 97%;
  height: 97%;
  position: absolute;
  z-index: -1;
}
`

var drawEdge = line()
    .x( (d) => d.offsetLeft )
    .y( (d) => d.offsetTop );


var shadowSVGSelector = (elem) => { var sdw = elem.shadowRoot;
                                    if(sdw) { return select(sdw.querySelector("svg")) }
                                       else { return select() }
};

var animate = (elem) => function(){
  // a hack, i don't know how to listen for shadowDOM to be ready the first time...
  var edgeLines = shadowSVGSelector(elem).selectAll("path")
      .data(elem.pairs)
  edgeLines.exit().remove();
  edgeLines.enter().append("path");
  edgeLines.attr("d",drawEdge);
  setTimeout( () => { window.requestAnimationFrame( animate(elem) ) }, 1000/elem.fps );
}

var updateNodes = function(elem){
  var nodes = select(elem).selectAll("*").nodes()
  console.log("updateNodes",nodes)
  if (nodes.length < 2) { return; }
  elem.pairs = cmb.combination(nodes,2).toArray()
}

const mainSlot = Symbol();
define('graph-viewer',
 {
   props: {
     fps: { attribute: true, default: 60 }
   },
   attached(elem) {
    console.log("graph-viewer attached")
    updateNodes(elem); // doesn't seem to be working
    animate(elem)();
  },
  attributeChanged(elem) {
    updateNodes(elem); // doesn't seem to be working
  },
  render(elem) {
    return [
      h('svg',{id:"abc"}),
      h('slot', {
        onSlotchange: (e) => {updateNodes(elem); /* console.log("slot change",e) */}
      }),
      h("style",css )
    ]
  },
});
