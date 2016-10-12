By adding transitions, we can more easily follow the elements as they are entered, updated and exited. Separate transitions are defined for each of the three states. To avoid repeating transition timing parameters for the enter, update, and exit selections, a top-level transition *t* sets the duration, and then subsequent transitions use [*selection*.transition](https://github.com/d3/d3-transition#selection_transition), passing in *t* to inherit timing:

```js
var t = d3.transition()
    .duration(750);
```

Want to read more? Try these tutorials:

* [Thinking with Joins](https://bost.ocks.org/mike/join/)
* [Nested Selections](https://bost.ocks.org/mike/nest/)
* [Object Constancy](https://bost.ocks.org/mike/constancy/)

See the [D3 wiki](https://github.com/d3/d3/wiki) for even more resources.

Previous: [Key Functions](/mbostock/3808221)
