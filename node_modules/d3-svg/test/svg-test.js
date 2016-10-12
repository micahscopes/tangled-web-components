// svg-test.js
var tape = require('tape-catch'),
    jsdom = require('jsdom'),
    d3_svg = require('../');

tape('d3_svg creates an svg element', function(test) {
  var document = jsdom.jsdom();
  global.document = document;
  var svg = d3_svg.create('body');
  test.ok(svg, 'svg element exists');
  delete global.document;
  test.end();
});

tape('d3_svg can set height and with on svg element', function(test) {
  var document = jsdom.jsdom();
  global.document = document;
  var svg = d3_svg.create('body', {width: 100, height: 50});
  test.ok(svg, 'svg element exists');
  test.ok(svg.attr('width', 100), 'svg element has correct width');
  test.ok(svg.attr('height', 50), 'svg element has correct height');
  delete global.document;
  test.end();
});

tape('d3_svg creates an svg element that can be appended to', function(test) {
  var document = jsdom.jsdom();
  global.document = document;
  var svg = d3_svg.create('body');
  var g = svg.append('g');
  test.ok(g, 'g element exists');
  delete global.document;
  test.end();
});