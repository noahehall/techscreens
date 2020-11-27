'use strict';

// file-relative configuration
// used as default config for web apps

const babelOpts = require('./babelOpts.js');

module.exports = function (api) {
  const isDev = api.env() !== 'production';


  // concat with child configs
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'last 2 versions, > 5%'
        },
        // import corejs polyfils as used by each file
        useBuiltIns: 'usage',
        // enable
        corejs: babelOpts.corejs,
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
      minify: false,
      srr: false,
      transpileTemplateLiterals: false,
      displayName: true,
      fileName: true,
      pure: false,
    }],
  ];


  return {
    plugins,
    presets,
  }
}
