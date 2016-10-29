import {edgeModifier, refreshEdges, getNodes} from './edges-all-pairs'
import {define, h} from 'skatejs'
import {interpolateRainbow} from 'd3-scale'
import {selectAll} from 'd3-selection'
import FloydWarshall from 'floyd-warshall'
// import core from 'mathjs/core'
// import matrices from 'mathjs/lib/type/matrix'

// var math = core.create();
// math.import(matrices)

const rainbow = (max) => (n) => interpolateRainbow(n/max)
const parseHops = (val) => JSON.parse("[" + val + "]")
const hops = (elem,modifier,showHops) => (edges) => {
  var nodes = elem[getNodes]()
  if (nodes.length < 2) { return []; }
  var colors = rainbow(nodes.length)
  var adj = [];
  for(var i=0; i<nodes.length; i++) {
      adj[i] = new Array(nodes.length);
  }

  edges.forEach((edge)=>{
    adj[nodes.indexOf(edge.source)][nodes.indexOf(edge.target)] = 1;
  })
  var hopMatrix = new FloydWarshall(adj).shortestPaths;
  var hops = []
  showHops = showHops ? showHops : [1]
  hopMatrix.forEach((row,i)=>{
    row.forEach((edge,j)=>{
      if(showHops.includes(edge)){
        hops.push({source: nodes[i], target: nodes[j], direction: 1, color: edge == 1 ? elem.color : colors(edge), thickness: elem.thickness-0.1*edge})
      }
    })
  })
 return hops;
}

const updateHops = (elem,showHops) => {
  var originalEdgeSets = selectAll(elem.children)
       .filter((d,i,nodes)=>{return nodes[i][edgeModifier];}).nodes()
  // console.log(originalEdgeSets)
  originalEdgeSets.forEach((edgeElem)=>{
    edgeElem[edgeModifier] = hops(edgeElem,elem,showHops)
    edgeElem[refreshEdges]();
  })
}

define('edges-modifier-hops', {
  props: {
    hops: { attribute: true, default: "2",
    coerce(val){console.log("coercing",parseHops(val)); var newVal = parseHops(val); return newVal},
    set(elem,data){ if(data.newValue != data.oldValue){ updateHops(elem,data.newValue) }}
    }
  },
  created(elem){
    elem[edgeModifier] = (edges) => edges
    elem[edgeData] = true
    updateHops(elem);
  },
  attributeChanged(elem){
    // console.log("updating graph hops modifier",elem.hops)
    // console.log("or...",elem.getAttribute("hops"))
    // updateHops(elem);
    // return true
  }
})
