'use strict';

// project-wide configuration
// used for ./run
// and set as default for all services but can be overriden
// with relative  .babelrcs
// https://babeljs.io/docs/en/config-files#config-function-api
// https://babeljs.io/docs/en/config-files
// https://babeljs.io/docs/en/options
// https://babeljs.io/docs/en/babel-core#createconfigitem
// https://babeljs.io/docs/en/plugins

const path = require('path');
const pkg = require('./package.json');
const babelNodeConfig = require('./tools/babel/babelNodeConfig.js');
const babelWebConfig = require('./tools/babel/babelWebConfig.js');


module.exports = function (api) {
    api.cache.using(() => process.env.NODE_ENV === 'development');

  // use this logic with webpack, as the same condition applies
  // babel env could be different than node_env
  const isDev = api.env() !== 'production';

  // runs the last item first
  const presets = [
    [
      "@babel/preset-typescript", {
        isTSX: true,
        jsxPragma: 'React',
        allExtensions: true,
        allowNamespaces: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      }
    ]
  ];


// RUNS FIRST TO LAST
  const plugins = [
  '@babel/plugin-syntax-dynamic-import',

    'babel-plugin-replace-ts-export-assignment',
  [
    '@babel/plugin-transform-runtime', {
        corejs: 3,
        absoluteRuntime: false,
          // useESModules: true,
        version: pkg.dependencies['@babel/runtime-corejs3']
      }
    ],
    'config-module-resolver', // copies paths from  tsconfig
    [
      // TODO: move this to webpack defineplugin?
      'module-resolver',
      {
        'extensions': ['.tsx', '.ts', '.js', '.es6', '.mjs', '.cjs', '.json'],
         // stripExtensions: [],
        cwd: process.env.NIRV_APP_ROOT,
         root: ['.'],
        loglevel: 'info',
        alias: {
          appRoot: process.env.NIRV_APP_ROOT,
          appSrc: './src',
          appTools: './tools',
          appDist: './dist',
        }
      },
    ],


    // 'lodash',
    'tailcall-optimization',
    [
      '@babel/plugin-proposal-decorators',
      {
        decoratorsBeforeExport: true,
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-throw-expressions',
    'transform-export-extensions',
  ];


  const overrides = [
    {
      test: ['./src/api', './src/client', './src/tools', '.'],
      exclude: ['./src/client/ui'],
      ...babelNodeConfig(api)

    },
    {
      test: ['./src/client/ui'],
      ...babelWebConfig(api)

    }
  ]

  console.log('\n\n wtf should be loading')
  return {
    presets,
    plugins,
    overrides,
  }
}
