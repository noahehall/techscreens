'use strict';

// project-wide configuration
// used for ./run
// and set as default for all services but can be overriden
// with relative  .babelrcs
// https://babeljs.io/docs/en/config-files#config-function-api
// https://babeljs.io/docs/en/config-files
// https://babeljs.io/docs/en/options
// https://babeljs.io/docs/en/babel-core#createconfigitem

const path = require('path');
const pkg = require('./package.json');

module.exports = function (api) {
  // use this logic with webpack, as the same condition applies
  // babel env could be different than node_env
  const isDev = api.env() !== 'production';

  api.cache(true);


  // runs the last item first
  const presets = [

  ];

  const plugins = [
    ["@babel/plugin-transform-modules-commonjs", {
      "allowTopLevelThis": true,
      "loose": true,
      "lazy": true
    }],

    [
      // TODO: move this to webpack defineplugin?
      'module-resolver',
      {
        "extensions": [".js", ".jsx", ".es", ".es6", ".mjs", '.cjs', '.json'],
        // stripExtensions: [],
        cwd: process.env.appRoot,
        root: ['.', './src'],
        loglevel: 'info',
        alias: {
          appRoot: process.env.appRoot,
          appSrc: './src',
          appTools: './tools',

        }
      },
    ],

    'tailcall-optimization',
    [
      '@babel/plugin-proposal-decorators',
      {
        decoratorsBeforeExport: true,
      }
    ],
    'lodash',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-optional-catch-binding',
    'transform-export-extensions',



    [
      '@babel/plugin-transform-runtime', {
        corejs: 3,
        absoluteRuntime: false,
        version: pkg.dependencies['@babel/runtime-corejs3']
      }
    ]
  ];

  const babelrcRoots = [
    '.',
    'src/*',
  ];

  return {

    presets,
    plugins,
    babelrcRoots,
  }
}
