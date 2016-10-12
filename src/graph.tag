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

    self.edges = function() {
      var coords = []
      self.nodes.each(function(){
        // console.log(this.offsetLeft)
        coords.push([this.offsetLeft,this.offsetTop]);
      })
      return cmb.combination(coords,2).toArray()
    }
    var drawEdge = line()
        .x( (d) => d[0] )
        .y( (d) => d[1] );

    var updateEdgeLines = function(){
      self.edgeLines.merge().attr('d', drawEdge )
    }

    this.on('mount',()=>{
      self.svg = select(self.root).selectAll("svg")
      self.nodes = select(self.root).selectAll('span')
      self.edgeLines = self.svg.selectAll("path").data(self.edges)
      self.edgeLines.exit().remove();
      self.edgeLines = self.edgeLines.enter().append("path");

      this.on('animate',updateEdgeLines)
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
