import {EdgesAllPairs, refreshEdges, getNodes, css} from './edges-all-pairs'
import {define, h} from 'skatejs'
import {select, selectAll} from 'd3-selection'
import core from 'mathjs/core'
import matrices from 'mathjs/lib/type/matrix'
import {parentGraphContainer} from './graph-container.js'

var math = core.create();
math.import(matrices)

define('edges-adjacency-matrix', EdgesAllPairs.extend({
  edges(elem){
    // console.log(elem)
    try{ var adj = JSON.parse(elem.innerHTML) }catch(e){ }
    var nodes = elem[getNodes]()
    if (nodes.length < 2) { return []; }
    var edges = [[nodes[0],nodes[1]]]
    edges = []
    adj.forEach((row,i)=>{
      row.forEach((edge,j)=>{
        if(edge == 1){
          edges.push({source: nodes[i], target: nodes[j], direction: 1})
        }
      })
    })
    // combos = combos.map((c)=> {return {source: c[0], target: c[1], direction: 1}})
    // console.log(edges)
    return edges
  },
  render(elem) {
    return [
      h('div',{style: "display: none"}, h('slot', {
        onSlotchange: elem[refreshEdges]
      })),
      h("style",css )
    ]
  },
}))
