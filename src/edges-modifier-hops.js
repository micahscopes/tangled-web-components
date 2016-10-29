import {edgeModifier, refreshEdges} from './edges-all-pairs'
import {define, h} from 'skatejs'
import {selectAll} from 'd3-selection'
// import core from 'mathjs/core'
// import matrices from 'mathjs/lib/type/matrix'

// var math = core.create();
// math.import(matrices)

const hops = (elem) => (edges) => {
 return [{source: 5, target: 2}];
}

define('edges-modifier-hops', {
  created(elem){
    elem[edgeModifier] = (edges) => edges
    elem[edgeData] = true
    var originalEdgeSets = selectAll(elem.children)
         .filter((d,i,nodes)=>{return nodes[i][edgeModifier];}).nodes()
    console.log(originalEdgeSets)
    originalEdgeSets.forEach((edgeElem)=>{
      edgeElem[edgeModifier] = hops(edgeElem)
      edgeElem[refreshEdges]();
    })
  },
  // edges(elem){
  //   console.log(elem)
  //   try{ var adj = eval(elem.innerHTML) }catch(e){ }
  //   var nodes = selectAll(elem.parentElement.children)
  //        .filter((d,i,nodes)=>{return !nodes[i][edgeData];}).nodes()
  //   if (nodes.length < 2) { return []; }
  //   var edges = [[nodes[0],nodes[1]]]
  //   edges = []
  //   adj.forEach((row,i)=>{
  //     row.forEach((edge,j)=>{
  //       if(edge == 1){
  //         edges.push({source: nodes[i], target: nodes[j], direction: 1})
  //       }
  //     })
  //   })
  //   // combos = combos.map((c)=> {return {source: c[0], target: c[1], direction: 1}})
  //   console.log(edges)
  //   return edges
  // },
  // render(elem) {
  //   return [
  //     h('slot')
  //   ]
  // },
})
