'use strict';

// file-relative configuration
// used as default configuration for node apps

const babelOpts = require('./babelOpts.js');

module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      // supports just node
      {
        targets: {
          node: true,
        },
        // import corejs polyfils as used by each file
        useBuiltIns: 'usage',
        // enable
        corejs: babelOpts.corejs,

        // modules: 'cjs'
      }
    ],

  ];

  const plugins = [

    // '@babel/plugin-transform-modules-commonjs',
  ];


  return {

    plugins,
    presets,
  }
}
