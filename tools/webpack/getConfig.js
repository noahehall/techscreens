'use strict';

// initial webpack.config

// import path from 'path';
const path = require('path');
const webpack = require('webpack');
const nirvPack = require('./nirvPack.js');
const fs = require('fs');

module.exports = function ({ configName, ...options }) {

  const configFile = require(`./webpack.${configName}.js`);

    // these MUST set in a child config
    // entry: options.entry || path.join(srcPath, 'main.js'),

    // these can be overriden in a child config
  return nirvPack(configFile(options));
}

