This example demonstrates applying [d3-drag](https://github.com/d3/d3-drag) to a [force-directed graph](/mbostock/f584aa36df54c451c94a9d0798caed35) computed using [d3-force](https://github.com/d3/d3-force). When the drag gesture starts, the targetted node is [fixed](https://github.com/d3/d3-force#simulation_fix) to the pointer; it is released when the gesture ends. In addition, the simulation is temporarily “heated” during interaction by setting the [target *alpha*](https://github.com/d3/d3-force#simulation_alphaTarget) to a non-zero value.

If desired, you could refine this technique by also fixing nodes on mouseover, and releasing them on mouseout. (However, if there’s an active drag gesture during mouseout, you wouldn’t want to release the node until the gesture finishes.)

Compare to the [Canvas version](/mbostock/ad70335eeef6d167bc36fd3c04378048).
