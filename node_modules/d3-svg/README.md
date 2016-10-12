# d3-svg

[![build status](https://travis-ci.org/53seven/d3-svg.svg)](https://travis-ci.org/53seven/d3-svg)

A micromodule that appends an svg to the dom and returns it ready to be used by a d3 plugin.

## Installing

If you use NPM, `npm install d3-svg`. Otherwise, download the [latest release](https://github.com/53seven/d3-svg/releases/latest).


## Behavior

This library abstracts the first few lines of any d3 chart that you see:

```js
  var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

```

This approach works when D3 is included as a global object. What about when you distribute charts as plugins or don't have a global D3 instance?

This plugin lets charts bootstrap themselves to the DOM without having to have D3 as a global object.

```js
// my_chart.js
import * as d3_svg from 'd3_svg';

function constructor(elem, opts) {
  var svg = d3_svg.create(elem, opts);

  function chartFunction(selection) {
    svg.selectAll('g')
  }

}

```

## API Reference

##### .create(elem, [opts])

Creates and returns a svg element that is attached to *elem*. *elem* can be a DOM object or a selector.

The *opts* object will set the width and height of the svg if set, otherwise these attributes will remain null.

## License

MIT