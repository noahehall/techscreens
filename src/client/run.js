'use strict';

// https://webpack.js.org/api/node/

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
    process.env.NODE_ENV === 'development' && 'webpack-hot-middleware/client?reload=false',
    './client/ui/main.js'
  ].filter(e => e),
  htmlPlugin: {
    template: './client/ui/index.html',
  }
});

helpers.run({ config, clientConfig });
