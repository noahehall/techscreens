'use strict';

// import path from 'path';

 const path = require('path');
const webpack = require('webpack');
const nirvPack = require('./nirvPack.js');
const fs = require('fs');


module.exports = function ({ configName, ...options }) {

  return nirvPack(require(`./webpack.${configName}.js`)(options));
}

