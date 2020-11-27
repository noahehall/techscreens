'use strict';

// https://webpack.js.org/api/node/

// TODO
// this shit can be futher simplified, e.g. doAllThisShit({ options })
// especiallly if we will use it to launch other node backends

// import express from 'express';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
import getConfig from 'appTools/webpack/getConfig.js';
import helpers from 'appTools/webpack/helpers.js';
import path from 'path';
import webpack from 'webpack';

const config = getConfig({
  name: 'bff',
  configName: 'node',
  entry: { bff: './client/bff/routes/index.js'},
});

const clientConfig = getConfig({
  name: 'ui',
  configName: 'web',
  target: 'web',
  entry: [
    'webpack-hot-middleware/client?reload=false',
    './client/ui/main.js'
  ]
});

helpers.watchAndRun({ config, clientConfig });
