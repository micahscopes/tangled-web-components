import {
  select,
  selectAll,
  namespaces
} from "d3-selection";
import { line } from "d3-shape"
import cmb from "js-combinatorics"
import { define, h, prop } from 'skatejs';
import * as skate from 'skatejs';
import {nearbyEdgePoints} from "./nearbyRectEdges.js"

import core from 'mathjs/core'
import matrices from 'mathjs/lib/type/matrix'

var math = core.create();
math.import(matrices)

const css=`
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

const setupSVG = function(svg){
  svg = select(svg)
  svg.append("g").attr("class", "links")

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

const detached = Symbol();
const animate = function(elem){
  elem.dispatchEvent(new Event('animate'));
  if (elem[detached]) return;
  setTimeout( () => { window.requestAnimationFrame( () => {animate(elem)} ) }, 1000/elem.fps );
}

const svgElement = Symbol();
const edgeData = Symbol()
const animateCallback = Symbol();
window.edgeData = edgeData;
window.svgElement = svgElement;

const graphAllEdges = {
  props: {
    fps: { attribute: true, default: 120 }
  },
  setupSVG: setupSVG,
  svgEdge(d,i,nodes){
    // console.log(d)
    var rect1 = d.source.getBoundingClientRect();
    var rect2 = d.target.getBoundingClientRect();
    var pts = nearbyEdgePoints(rect1,rect2)
      return line()
      .x( (d) => d.x )
      .y( (d) => d.y )(pts);
    },

  refreshAnimation(elem){
    // console.log(elem[edgeData])
    var edgeLines = select(elem[svgElement]).select('g').selectAll("path")
        .data(elem[edgeData])
    edgeLines.exit().remove();
    edgeLines.enter().append("path")
          .style('marker-start', (d) => d.direction <= 0 ? 'url(#start-arrow)' : '')
          .style('marker-end', (d) => d.direction >= 0 ? 'url(#end-arrow)' : '');
    edgeLines.attr("d",this.svgEdge)
          .style('marker-start', (d) => d.direction <= 0 ? 'url(#start-arrow)' : '')
          .style('marker-end', (d) => d.direction >= 0 ? 'url(#end-arrow)' : '');
  },

  edges(elem){
    var nodes = select(elem.parentElement).selectAll("*")
         .filter((d,i,nodes)=>{return !nodes[i][edgeData];}).nodes()
         console.log(nodes)
    if (nodes.length < 2) { return []; }
    var combo = cmb.combination(nodes,2).toArray()
    // console.log(combo.map((c)=> {return {source: c[0], target: c[1], direction: 0}}))
    return combo.map((c)=> {return {source: c[0], target: c[1], direction: 0}})
  },

  attached(elem) {
    animate(elem);
    elem[edgeData] = [];
    console.log(this)
    elem[svgElement] = document.createElementNS(namespaces.svg,"svg")
    this.setupSVG(elem[svgElement])
    elem[animateCallback] = ()=>{this.refreshAnimation(elem)}
  },

  detached(elem) {
    // console.log("detached",elem)
    elem[detached] = true;
    elem.removeEventListener('animate',elem[animateCallback])
  },

  attributeChanged(elem) {
    if(this){
      elem[edgeData] = this.edges(elem);
    }
  },

  render(elem) {
    return [
      h('div',{style: "display: none"}, h('slot', {
        onSlotchange: (e) => {this.attributeChanged(elem); /* console.log("slot change",e) */}
      })),

      h("style",css )
    ]
  },

  rendered(elem){
    elem[skate.symbols.shadowRoot].appendChild(elem[svgElement])
    console.log("rendered")
    elem[edgeData] = this.edges(elem);
    elem.addEventListener('animate',elem[animateCallback])
  }
};

export const EdgesAllPairs = define('edges-all-pairs',graphAllEdges);
