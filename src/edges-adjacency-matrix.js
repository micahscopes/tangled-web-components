import {EdgesAllPairs} from './edges-all-pairs'
import {define} from 'skatejs'
import {select} from 'd3-selection'
import core from 'mathjs/core'
import matrices from 'mathjs/lib/type/matrix'

var math = core.create();
math.import(matrices)

define('edges-adjacency-matrix', EdgesAllPairs.extend({
  edges(elem){
    var nodes = select(elem.parentElement).selectAll("*")
         .filter((d,i,nodes)=>{return !nodes[i][edgeData];}).nodes()
    if (nodes.length < 2) { return []; }
    var combos = [[nodes[0],nodes[1]]]
    combos = combos.map((c)=> {return {source: c[0], target: c[1], direction: 1}})
    console.log(combos)
    return combos
  }
}))
