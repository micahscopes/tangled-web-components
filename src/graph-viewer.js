// import {math} from 'mathjs'
// import {
//   event,
//   select,
//   selectAll
// } from "d3-selection";
// import { zip } from "d3-array"
// import { line } from "d3-shape"
// import cmb from "js-combinatorics"
import {h,prop} from "skatejs"
const sym = Symbol();

export let graphViewer = {
  props: {
    // By declaring the property an attribute, we can now pass an initial value
    // for the count as part of the HTML.
    count: prop.number({ attribute: true })
  },
  attached(elem) {
    // We use a symbol so we don't pollute the element's namespace.
    elem[sym] = setInterval(() => ++elem.count, 1000);
  },
  detached(elem) {
    // If we didn't clean up after ourselves, we'd continue to render
    // unnecessarily.
    clearInterval(elem[sym]);
  },
  // render(elem) {
  //   // console.log(elem,"rendering");
  //   // By separating the strings (and not using template literals or string
  //   // concatenation) it ensures the strings are diffed indepenedently. If
  //   // you select "Count" with your mouse, it will not deselect whenr endered.
  //   // return h('div', 'Seconds: ', elem.count);
  // }
};

// export {graphViewer};
    // this.mixin(Animate);
    // const name = 'nodes';
    // var self = this;
    //
    // var drawEdge = line()
    //     .x( (d) => d.offsetLeft )
    //     .y( (d) => d.offsetTop );
    //
    // self.updateEdges = function(doms){
    //   var nodes = select(self.nodes).selectAll('*').nodes()
    //   console.log(nodes)
    //   var pairs = cmb.combination(nodes,2).toArray()
    //   var edgeLines = select(self.root).select("svg").selectAll("path")
    //       .data(pairs)
    //   edgeLines.exit().remove();
    //   edgeLines.enter().append("path");
    // }
    //
    // self.updateEdgeSegments = function(){
    //   select(self.root).select("svg").selectAll("path")
    //       .attr("d",drawEdge)
    // }
    //
    // this.on('mount',()=>{
    //   self.updateEdges()
    //   this.on('animate',self.updateEdgeSegments)
    // });
    //
