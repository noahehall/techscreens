'use strict';


module.exports = function (api) {
  api.cache(true);

  return {
    extends: process.env.NIRV_APP_TOOLS + '/babel/babelWebConfig.js',
  }
}
