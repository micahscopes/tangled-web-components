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
import {drawEdge, cacheBoundingRect} from './drawGraph.js'
import core from 'mathjs/core'
import matrices from 'mathjs/lib/type/matrix'

var math = core.create();
math.import(matrices)

export const css=`
canvas {
  // width: 100%;
  // height: 100%;
  padding: 0; margin: 0;
  left:0; top:0;
  position: fixed;
  overflow: hidden;
  z-index: -1;
}

`
const detached = Symbol();
const animate = function(elem){
  elem.dispatchEvent(new Event('animate'));
  if (elem[detached]) return;
  setTimeout( () => { window.requestAnimationFrame( () => {animate(elem)} ) }, 1000/elem.fps );
}

export const canvas = Symbol();
export const edgeData = Symbol();
export const getNodes = Symbol();
export const animateCallback = Symbol();
export const refreshEdges = Symbol();
export const rectCache = Symbol();

window.edgeData = edgeData;
window.canvas = canvas;

const graphAllEdges = {
  props: {
    fps: { attribute: true, default: 120 },
    color: { attribute: true, default: "yellow" },
    thickness: { attribute: true, default: 1 }
  },
  refreshAnimation(elem){
    var nodes = elem[getNodes]();
    nodes.forEach(cacheBoundingRect);
    var ctx = elem[canvas].getContext("2d");
    if(ctx == undefined){return;}
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    ctx.strokeStyle = elem.color;
    ctx.fillStyle = elem.color;
    ctx.lineWidth = elem.thickness;

    elem[edgeData].forEach((edge) => drawEdge(ctx,edge,elem.thickness));
  },

  edges(elem){
    var nodes = elem[getNodes]();
    console.log("number of nodes", nodes.length)
    if (nodes.length < 2) { return []; }
    // var combo = cmb.combination(nodes,2).toArray()
    // console.log(combo.map((c)=> {return {source: c[0], target: c[1], direction: 0}}))
    var combos = []
    nodes.forEach((n)=>{
      nodes.forEach((m)=>{
        if(n==m){ return; }
        combos.push({source: n, target: m, direction: 1})
      })
    })
    console.log("number of 2x combinations", combos.length)

    return combos
  },

  attached(elem) {
    elem[animateCallback] = ()=>{this.refreshAnimation(elem)}

    animate(elem);
    elem[getNodes] = () => selectAll(elem.parentElement.children)
         .filter((d,i,nodes)=>{return !nodes[i][edgeData];}).nodes()
    elem[edgeData] = [];
    // console.log(this)
    elem[canvas] = document.createElement("canvas")

    elem[refreshEdges] = (e) => {elem[edgeData] = this.edges(elem);}
    elem.parentElement.addEventListener('graph-updated', elem[refreshEdges])
  },

  detached(elem) {
    // console.log("detached",elem)
    elem[detached] = true;
    elem.removeEventListener('animate',elem[animateCallback])
  },

  attributeChanged(elem) {
  },

  render(elem) {
    return [
      h('div',{style: "display: none"}, h('slot', {
      })),

      h("style",css )
    ]
  },

  rendered(elem){
    elem[skate.symbols.shadowRoot].appendChild(elem[canvas])
    // console.log("rendered")
    elem[edgeData] = this.edges(elem);
    elem.addEventListener('animate',elem[animateCallback])
  }
};

export const EdgesAllPairs = define('edges-all-pairs',graphAllEdges);
