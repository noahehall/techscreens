'use strict';

// https://webpack.js.org/api/node/

import getConfig from 'appTools/webpack/getConfig.js';
import helpers from 'appTools/webpack/helpers.js';
import path from 'path';


helpers.watchAndRun({ config: getConfig({
  name: 'api',
  configName: 'node',
  entry: { api: './api/routes/index.js'},
}) });

// import getConfig from 'appTools/webpack/getConfig.js';
// import helpers from 'appTools/webpack/helpers.js';
// import path from 'path';

// helpers.run({ config: getConfig({
//   name: 'api',
//   configName: 'node',
//   entry: { api: './api/routes/index.js'},
// }) });
