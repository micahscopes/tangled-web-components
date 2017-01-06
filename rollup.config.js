// Rollup plugins
import babel from 'rollup-plugin-babel';
// import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
//import includePaths from 'rollup-plugin-includepaths';
import pathmodify from 'rollup-plugin-pathmodify';
import replace from 'rollup-plugin-replace'

export default {
  entry: 'src/main.js',
  acorn: {
    allowReserved: true
  },
  dest: 'dist/tangled-web-components.js',
  format: 'iife',
  // sourceMap: 'inline',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: false,  // Default: true
//      skip: [ 'skatejs' ] // handle this dependency manually using rollup-plugin-includepaths
    }),
    replace(
        { DEBUG: JSON.stringify(false) }
    ),
    pathmodify({
        aliases: [
//            {
//                id: "skatejs",
//                resolveTo: __dirname + "/node_modules/skatejs/dist/index-with-deps.js"
//            }
        ]
    }),

    commonjs({
//        namedExports: {"skatejs": ['h','define','Component']}
    }),
    // eslint({
    //   exclude: [
    //     'src/styles/**',
    //   ]
    // }),
    babel({
      // exclude: 'node_modules/**',
    }),
  ],
};
