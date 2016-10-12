export {d3_svg as create};

import * as d3_selection from 'd3-selection';

function d3_svg(elem, opts) {
  var body = d3_selection.select(elem);

  var svg = body.append('svg');

  if (opts && opts.width) {
    svg.attr('width', opts.width);
  }
  if (opts && opts.height) {
    svg.attr('height', opts.height);
  }
  return svg;
}
