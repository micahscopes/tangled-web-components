import {edgeModifier, refreshEdges, getNodes} from './edges-all-pairs'
import {define, h} from 'skatejs'
import {interpolateRainbow} from 'd3-scale'
import {selectAll} from 'd3-selection'
import FloydWarshall from 'floyd-warshall'
// import core from 'mathjs/core'
// import matrices from 'mathjs/lib/type/matrix'

// var math = core.create();
// math.import(matrices)
function repeatAry(ary, times)
{
    var result = Array();
    for(var i=0;i<times;i++)
      result = result.concat(ary);
    return result;
}

const rainbow = (max) => (n) => interpolateRainbow(n/max)
const parseHops = (val) => JSON.parse("[" + val + "]")
const hops = (elem,modifier) => (edges) => {
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
  hopMatrix.forEach((row,i)=>{
    row.forEach((hop,j)=>{
      if(hop != 1 && modifier.hops.includes(hop)){
        var thickness = elem.thickness*(1-hop/(nodes.length+1));
        hops.push({source: nodes[i], target: nodes[j],
          // segments: [5,10],
          segments: repeatAry([thickness,thickness],hop-1).concat([thickness,thickness*thickness+5*thickness]),
          direction: 1, color: colors(hop),
          thickness: thickness})
      }
    })
  })
  if(modifier.hops.includes(1)) {
    hops = hops.concat(edges)
  }
 return hops;
}

const updateHops = (elem) => {
  var originalEdgeSets = selectAll(elem.children)
       .filter((d,i,nodes)=>{return nodes[i][edgeModifier];}).nodes()
  // console.log(originalEdgeSets)
  originalEdgeSets.forEach((edgeElem)=>{
    edgeElem[edgeModifier] = hops(edgeElem,elem)
    edgeElem[refreshEdges]();
  })
}

define('edges-modifier-hops', {
  props: {
    hops: { attribute: true, default: "2",
    coerce(val){ var newVal = parseHops(val); return newVal},
    // set(elem,data){ updateHops(elem) }
    }
  },
  created(elem){
    elem[edgeModifier] = (edges) => edges
    elem[edgeData] = true
    updateHops(elem);
  },
  updated(elem){
    console.log("updating graph hops modifier",elem.hops)
    console.log("or...",elem.getAttribute("hops"))
    updateHops(elem);
    // return true
  }
})
