'use strict';

module.exports = function (api) {
  api.cache(true);

  return {
    extends: process.env.appTools + '/babel/babelNodeConfig.js',
  }
}
