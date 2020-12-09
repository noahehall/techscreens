'use strict';

// file-relative configuration
// used as default config for web apps

const babelOpts = require('./babelOpts.js');


module.exports = function (api) {
  const isDev = api.env() !== 'production';
  const isProd = !isDev;

  // concat with child configs
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'last 2 versions, > 5%'
        },
        useBuiltIns: 'usage',
        corejs: babelOpts.corejs,
        modules: 'auto',
        bugfixes: true,
      }
    ],

    [
      '@babel/preset-react', {
         runtime: 'automatic',
         development: isDev,
      }
    ],
  ];

  // concat with child configs
  const plugins = [
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-react-inline-elements',
    ['babel-plugin-styled-components', {
      displayName: isDev,
      fileName: isDev,
      minify: isProd,
      pure: isProd,
      srr: false,
      transpileTemplateLiterals: isProd,
    }],
  ];


  return {
    plugins,
    presets,
  }
}
