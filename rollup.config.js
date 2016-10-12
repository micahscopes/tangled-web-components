import riot from 'rollup-plugin-riot'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/main.js',
  dest: 'dist/riot-d3-graphs.js',
  plugins: [
    riot(),
    nodeResolve({
      jsnext: true, // if provided in ES6
      main: true, // if provided in CommonJS
      browser: true, // if provided for browsers
      preferBuiltins: false  // Default: true
    }),
    commonjs(),
    // babel()
    // uglify()
  ]
}
