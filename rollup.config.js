// // import riot from 'rollup-plugin-riot'
// import nodeResolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
// import uglify from 'rollup-plugin-uglify'
// import babel from 'rollup-plugin-babel'
//
// export default {
//   entry: 'src/main.js',
//   dest: 'dist/graph-components.js',
//   plugins: [
//     // riot(),
//     nodeResolve({
//       jsnext: true, // if    provided in ES6
//       main: true, // if provided in CommonJS
//       browser: true, // if provided for browsers
//       preferBuiltins: false  // Default: true
//     }),
//     commonjs(),
//     babel()
//     // uglify(),
//   ]
// }

// Rollup plugins
import babel from 'rollup-plugin-babel';
// import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  dest: 'dist/graph-components.js',
  format: 'iife',
  // sourceMap: 'inline',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: false  // Default: true
    }),
    commonjs(),
    // eslint({
    //   exclude: [
    //     'src/styles/**',
    //   ]
    // }),
    babel({
      // exclude: 'node_modules/**',
    }),
    // uglify({}, minify),
  ],
};
