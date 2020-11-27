'use strict';

// file is WAAY tooo wet, lets DRY it up
// focused on dev (not prod)
// removed options for libraries (see other app for how ew set this up originall)

// todos n shit
// https://webpack.js.org/guides/author-libraries/

const rootPkg = require('../../package.json')

// nirvPack
// final task in packaging a program with webpack
// should only be called from webpack.config.babel.js

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// TODO
// need to exclud eassets from webworker ?
// @see https://github.com/GoogleChrome/workbox/blob/v5/packages/workbox-webpack-plugin/src/inject-manifest.js

const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// this should be in web config
// const { InjectManifest } = require('workbox-webpack-plugin'); // fails on webpack 5? verify for web


const env = process.env;
const addPath = (p = '.') => path.resolve(env.appRoot, p);

function isR (name) {
  if (typeof name === 'undefined') throw `${name} is required`;
}


module.exports = function ({
  pkg = rootPkg,
  deps = Object.keys(pkg.dependencies || {}),
  peerDeps = Object.keys(pkg.peerDependencies || {}),

  entry = isR('entry'),
  publicPath = '/',
  output = {},

  optimization = {}, // https://webpack.js.org/guides/caching/
  performance = {},
  plugins = [],
  resolve = {
    alias: {},
    modules: [process.env.appRoot, 'node_modules'],
    preferRelative: true,
    extensions: ['*', '.js', '.mjs', '.cjs', '.jsx', '.json'],
  }, // https://github.com/webpack/webpack/issues/981

  mode = env.NODE_ENV === 'development' ? 'development' : 'production',
  externals = true, //use to be removeExternals, ensure consumers are updated
  target = 'node',

  ...providedOptions
}) {
  // child functions able to use the consumer provided params

  // each output bundle output.path + filename
  const filename = mode === 'production'
    ? '[name].[contentHash].bundle.js'
    : '[name].bundle.js';
  // each non-initial chunk files output.path + chunkFilename
  const chunkFilename = 'production'
    ? '[name].[contentHash].chunk.bundle.js'
    : '[name].chunk.js'


  switch (target) {
    case 'web': {
      externals = false;
    }
  }

  // sets the final output
  const getOutput = (useTarget = target) => ({
    publicPath: publicPath,
    path: `${env.appDist}/${providedOptions.name}`,
    filename,
    chunkFilename,
    // library: 'poop', depends on libraryTarget value
    ...(
      useTarget === 'web'
        ? {
            libraryTarget: 'umd',
          }
        : {
            libraryTarget: 'commonjs2', // https://github.com/webpack/webpack/issues/1114
          }
    ),

    // only useful for libraries
    // globalObject: "typeof self !== 'undefined' ? self : this",
  });

  // TODO
  // externals({ modulesFromFile: true })
  // externals({ mmodulesDir: __dirname })
  const getExternals = (shouldRemove = externals) => (
    shouldRemove
      ? [...peerDeps.concat(deps), webpackNodeExternals({ modulesFromFile: true })]
      : peerDeps
  );

  const getResolve = (useResolve = resolve) => {
    const { alias = {}, ...overides } = resolve;

    return {
      alias: {
        moment$: 'moment/moment.js',
        ...alias
      },
      ...overides,

      // think about this
      // mainFields: options.target === 'web' || options.target === 'webworker'
      //   ? ['module', 'browser', 'main']
      //   : ['module', 'main']
    };
  }

  const ifDev = mode !== 'development';
  const ifProd = mode === 'production';


  // default options
  const options = {
      target,
      devtool: ifProd ? 'cheap-source-map' : 'eval-cheap-module-source-map',
      mode,
      context: env.appSrc,
      entry,
  };

  // overrides for specific envs
  switch (target) {
    case 'node': {
      // options.externals = true;

      break;
    }

    case 'web': {
      // options.webworker = true;
      // options.externals = false;

      break;
    }
  }



  return {
    ...providedOptions,
    ...options,
    cache: false,

    // further extend  options
    output: getOutput(options.target, output),
    externals: getExternals(options.externals),
    resolve: getResolve(),
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),

      new webpack.DefinePlugin({
        // make these available in compiled code
        appEnv: {
          CLIENT_HOST: JSON.stringify(env['CLIENT_HOST']),
          CLIENT_PORT: JSON.stringify(env['CLIENT_PORT']),
          BFF_HOST: JSON.stringify(env['BFF_HOST']),
          BFF_PORT: JSON.stringify(env['BFF_PORT']),
          API_HOST: JSON.stringify(env['API_HOST']),
          API_PORT: JSON.stringify(env['API_PORT']),
        },
      }),

      // ...(
      //   ifDev
      //     ? [
      //         new CircularDependencyPlugin({
      //           exclude: /\.js|node_modules/, // exclude node_modules
      //           failOnError: false, // show a warning when there is a circular dependency
      //         }),
      //       ]
      //     : []
      // ),

      ...plugins,

      // dont think we are ready to setup worker logic just yet
      // webworker && (
      //   new InjectManifest({
      //     swSrc: './src/workers/rootServiceWorker.js',
      //     swDest: 'sw.js',
      //   })
      // ),

      // new BundleAnalyzerPlugin()
    ].filter(e => e),


    module: {
      ...(options.module || {}),
      rules: [
        // {
        //   test: /\.m?js$/,
        //   resolve: {
        //     fullySpecified: false // disable the behaviour
        //   }
        // },
        {
          test: /\.(js|cjs)$/,
          exclude: /node_modules/,
          // include: [ env.appSrc ],
          use: {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward'
            }
          },
        },
        {
          // Preprocess our own .css files
          // This is the place to add your own loaders (e.g. sass/less etc.)
          // for a list of loaders, see https://webpack.js.org/loaders/#styling
          test: /\.css$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          // Preprocess 3rd party .css files located in node_modules
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          use: 'file-loader',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                // Inline files smaller than 10 kB
                limit: 10 * 1024,
                noquotes: true,
              },
            },
          ],
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                // Inline files smaller than 10 kB
                limit: 10 * 1024,
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
        {
          test: /\.(mp4|webm)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        },
        ...(options.module && options.module.rules || []),
      ].filter(e => e)
    },
    optimization,
    performance,
  }
}
