import {EdgesAllPairs} from './edges-all-pairs'
import {define} from 'skatejs'
import {select, selectAll} from 'd3-selection'
import core from 'mathjs/core'
import matrices from 'mathjs/lib/type/matrix'

var math = core.create();
math.import(matrices)

define('edges-adjacency-matrix', EdgesAllPairs.extend({
  edges(elem){
    console.log(elem)
    try{ var adj = eval(elem.innerHTML) }catch(e){ }
    var nodes = selectAll(elem.parentElement.children)
         .filter((d,i,nodes)=>{return !nodes[i][edgeData];}).nodes()
    if (nodes.length < 2) { return []; }
    var combos = [[nodes[0],nodes[1]]]
    combos = []
    adj.forEach((row,i)=>{
      row.forEach((edge,j)=>{
        if(edge == 1){
          combos.push({source: nodes[i], target: nodes[j], direction: 1})
        }
      })
    })
    // combos = combos.map((c)=> {return {source: c[0], target: c[1], direction: 1}})
    console.log(combos)
    return combos
  }
}))
