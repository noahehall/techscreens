'use strict';


const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');


module.exports = function (opts = {}) {
  return {
    ...opts,
  }
};
