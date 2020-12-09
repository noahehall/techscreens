'use strict';

// file-relative configuration
// used as default configuration for node apps

const babelOpts = require('./babelOpts.js');

module.exports = function (api) {

  const presets = [
    [
      // https://babeljs.io/docs/en/babel-preset-env
      '@babel/preset-env',
      {
        targets: {
          node: true,
        },
        // import corejs polyfils as used by each file
        useBuiltIns: 'usage',
        corejs: babelOpts.corejs,
        modules: 'auto',
        bugfixes: true,
      }
    ],

  ];

  const plugins = [
     // ["dynamic-import-node", { "noInterop": true }]
  ];


  return {

    plugins,
    presets,
  }
}
