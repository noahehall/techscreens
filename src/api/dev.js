'use strict';

// https://webpack.js.org/api/node/

// TODO
// this shit can be futher simplified, e.g. doAllThisShit({ options })
// especiallly if we will use it to launch other node backends


import getConfig from 'appTools/webpack/getConfig.js';
import helpers from 'appTools/webpack/helpers.js';
import path from 'path';


helpers.watchAndRun({ config: getConfig({
  name: 'api',
  configName: 'node',
  entry: { api: './api/routes/index.js'},
}) });
