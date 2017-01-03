// Rollup plugins
import babel from 'rollup-plugin-babel';
// import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

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
  ],
};
