import {
  select,
  selectAll
} from "d3-selection";
import { line } from "d3-shape"
import cmb from "js-combinatorics"
import { define, h, prop } from 'skatejs';
import * as skate from 'skatejs';
import {nearbyEdgePoints} from "./nearbyRectEdges.js"
var css=`
path {
  stroke: var(--color,#0f0);
  stroke-width: var(--thickness,4px);
  fill:none
}
svg {
  width: 100%;
  height: 100%;
  left:0; top:0;
  position: fixed;
  overflow: hidden;
  z-index: -1;
}
`
var shadowSVGSelector = (elem) => { var sdw = elem.shadowRoot;
                                    if(sdw) { return select(sdw.querySelector("svg")) }
                                       else { return select() }
};

function setupArrows(svg){
  // define arrow markers for graph links
  var defs = svg.append('svg:defs')
  defs.append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 10)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', 'white');

  defs.append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', 'white');
}

const edges = Symbol()
const animateCallback = Symbol();
var graphEdgesPoly = {
  svgEdge(d,i,nodes){
    // console.log(d)
    var rect1 = d[0].getBoundingClientRect();
    var rect2 = d[1].getBoundingClientRect();
    var pts = nearbyEdgePoints(rect1,rect2)
      return line()
      .x( (d) => d.x )
      .y( (d) => d.y )(pts);
    },
  redraw(elem){
    var edgeLines = shadowSVGSelector(elem).selectAll("path")
        .data(elem[edges])
    edgeLines.exit().remove();
    edgeLines.enter().append("path").classed('edge',true)
          .style('marker-start', 'url(#start-arrow)')
          .style('marker-end', 'url(#end-arrow)');

    shadowSVGSelector(elem).selectAll('.edge').attr("d",this.svgEdge)
          .style('marker-start', 'url(#start-arrow)')
          .style('marker-end', 'url(#end-arrow)');
  },
  edges(elem){
    var nodes = select(elem.parentElement).selectAll("*")
         .filter((d,i,nodes)=>{return !nodes[i].edges;}).nodes()
    if (nodes.length < 2) { return []; }
    return cmb.combination(nodes,2).toArray()
  },
   props: {
     nodeContainer: { attribute: true }
   },
   attached(elem) {
    elem.edges = () => elem[edges];
    elem[edges] = this.edges(elem);
    elem[animateCallback] = ()=>{this.redraw(elem)}
    elem.parentElement.addEventListener('animate',elem[animateCallback])
    setTimeout(() => {setupArrows(shadowSVGSelector(elem))},10);
  },
  detached(elem) {
    // console.log("detached",elem)
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
  }
};

define('edges-all-pairs',graphEdgesPoly);

const animate = function(elem){
  elem.dispatchEvent(new Event('animate'));
  setTimeout( () => { window.requestAnimationFrame( () => {animate(elem)} ) }, 1000/elem.fps );
}

define('graph-container',
 {
   props: {
     fps: { attribute: true, default: 120 }
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
