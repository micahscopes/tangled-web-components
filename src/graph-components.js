import {
  select,
  selectAll
} from "d3-selection";
import { line } from "d3-shape"
import cmb from "js-combinatorics"
import { define, h, prop } from 'skatejs';
import * as skate from 'skatejs';
import Kefir from 'kefir';

var css=`
path {stroke: #0f0; stroke-width:4px; fill:none}
svg {
  width: 97%;
  height: 97%;
  position: absolute;
  z-index: -1;
}
`
var svgEdge = line()
    .x( (d) => d.offsetLeft )
    .y( (d) => d.offsetTop );

var shadowSVGSelector = (elem) => { var sdw = elem.shadowRoot;
                                    if(sdw) { return select(sdw.querySelector("svg")) }
                                       else { return select() }
};

const edges = Symbol()
const animateCallback = Symbol();
var graphEdgesPoly = {
  redraw(elem){
    var edgeLines = shadowSVGSelector(elem).selectAll("path")
        .data(elem[edges])
    edgeLines.exit().remove();
    edgeLines.enter().append("path");
    edgeLines.attr("d",svgEdge);

    // console.log("animate",elem[edges]);
  },
  edges(elem){
    var nodes = select(elem.parentElement).selectAll("*").filter(() => !this.edges).nodes()
    console.log("updateEdges",elem.parentElement)
    if (nodes.length < 2) { return []; }
    return cmb.combination(nodes,2).toArray()
  },
   props: {
     nodeContainer: { attribute: true }
   },
   attached(elem) {
    elem[edges] = this.edges(elem);
    elem[animateCallback] = ()=>{this.redraw(elem)}
    elem.parentElement.addEventListener('animate',elem[animateCallback])
  },
  detached(elem) {
    elem.parentElement.removeEventListener('animate',elem[animateCallback])
  },
  attributeChanged(elem) {
    elem[edges] = this.edges(elem);
  },
  render(elem) {
    return [
      h('svg',{id:"abc"}),
      h('slot', {
        onSlotchange: (e) => {this.attributeChanged(elem); /* console.log("slot change",e) */}
      }),
      h("style",css )
    ]
  },
};

define('edges-all-pairs',graphEdgesPoly);

const animate = function(elem){
  elem.dispatchEvent(new Event('animate'));
  setTimeout( () => { window.requestAnimationFrame( () => {animate(elem)} ) }, 1000/elem.fps );
}

define('graph-container',
 {
   props: {
     fps: { attribute: true, default: 60 }
   },
   attached(elem) {
     animate(elem);
  },
  attributeChanged(elem) {
  },
  render(elem) {
    return [
      h('slot', {
      }),
      h("style",css )
    ]
  },
});
