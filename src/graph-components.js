// import {math} from 'mathjs'
import {fromEvent} from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/debounce';

import {
  event,
  select,
  selectAll
} from "d3-selection";
import { zip } from "d3-array"
import { line } from "d3-shape"
import cmb from "js-combinatorics"
import { define, h, prop } from 'skatejs';
import * as skate from 'skatejs';
const sym = Symbol();

var css=`
path {stroke: #0f0; stroke-width:2px;fill:none}
svg {
  width: 97%;
  height: 97%;
  position: absolute;
}
`

var drawEdge = line()
    .x( (d) => d.offsetLeft )
    .y( (d) => d.offsetTop );


var shadowSVGSelector = (elem) => { var sdw = elem.shadowRoot;
                                    if(sdw) { return select(sdw.querySelector("svg")) }
                                       else { return select() }
};

var animate = (elem) => {function(elem){
  shadowSVGSelector(elem).selectAll("path")
      .attr("d",drawEdge)
  window.requestAnimationFrame( animate(elem) );
}}

var updateNodes = function(elem){
  var nodes = select(elem).selectAll("*").nodes()
  console.log("updateNodes",nodes)
  nodes.forEach(function(node){
    var positionChanges = fromEvent(node,"moved");
    elem.positionObserver.observe(node, {
        attributes: true,
        attributeFilter: ['offsetLeft','offsetTop'],
    });
    positionChanges.debounce(500).subscribe(() => {updateEdgeSegments(node)});
    positionChanges.subscribe(() => {console.log(node,"moved")});
  });
  if (nodes.length < 2) { return; }
  var pairs = cmb.combination(nodes,2).toArray()
  var edgeLines = shadowSVGSelector(elem).selectAll("path")
      .data(pairs)
  // console.log(edgeLines)
  // console.log(pairs)
  edgeLines.exit().remove();
  edgeLines.enter().append("path");
  updateEdgeSegments(elem);
}

const mainSlot = Symbol();
define('graph-viewer',
 {
  props: {
    count: prop.number({ attribute: true })
  },
  attached(elem) {
    elem.updateNodes = updateNodes;
    elem.updateEdgeSegments = updateEdgeSegments;
    console.log("graph-viewer attached")
    elem.positionObserver = new MutationObserver(function(mutation){ console.log(mutation) });
    // elem[sym] = setInterval(() => ++elem.count, 1000);
    // elem.graphNodes = () => {
    //   console.log(elem[mainSlot]);
    //   elem[mainSlot].assignedNodes()}
  },
  detached(elem) {
    clearInterval(elem[sym]);
  },
  render(elem) {
    // console.log("ready")
    // console.log(elem[skate.symbols.shadowRoot]);
    // console.log(select(elem[skate.symbols.shadowRoot]))
    // console.log(select(elem[skate.symbols.shadowRoot]).select("slot"))
    updateEdgeSegments(elem);
    return [
      h('svg',{id:"abc"}),
      h('slot', {
        onSlotchange: (e) => {updateNodes(elem); /* console.log("slot change",e) */}
      }),
      h("style",css )
    ]
  },
});
