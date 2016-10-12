import {Animate} from './mixins.js'
import {math} from 'mathjs'
import {
  event,
  select,
  selectAll
} from "d3-selection";
import { zip } from "d3-array"
import { line } from "d3-shape"
import cmb from "js-combinatorics"

<graph>
  <svg name="svg">
    <circle cx="300" cy="100" r="20"></circle>
  </svg>
  <yield/>
  <div>hey</div>
  <script>
    this.mixin(Animate);
    const name = 'nodes';
    var self = this;

    var drawEdge = line()
        // .x(function(d){
        //   console.log(d);
        // })
        .x( (d) => d.offsetLeft )
        .y( (d) => d.offsetTop );

    self.updateEdges = function(doms){
      var nodes = select(self.root).selectAll('span').nodes()
      // console.log(nodes)
      // console.log(select(self.root).selectAll('span'))
      var pairs = cmb.combination(nodes,2).toArray()
      console.log(pairs)
      var edgeLines = select(self.root).select("svg").selectAll("path")
          .data(pairs)
      edgeLines.exit().remove();
      edgeLines.enter().append("path");
    }

    self.updateEdgeSegments = function(){
      select(self.root).select("svg").selectAll("path")
          .attr("d",drawEdge)
    }

    this.on('mount',()=>{
      self.updateEdges()
      this.on('animate',self.updateEdgeSegments)
    });

  </script>
  <style scoped>
    span {
      position: absolute;
      border: solid black 1px;
      background-color: black;
      color: white;
    }
    path {stroke: #0f0; stroke-width:2px;fill:none}
    svg {
      width: 97%;
      height: 97%;
      position: absolute;
    }
  </style>
</graph>
