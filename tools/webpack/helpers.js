'use strict';

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');


function createWebpackMiddleware(compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    writeToDisk: true,
    // logLevel: 'warn',
    publicPath,
    // silent: true,
    // hot: true,
    // stats: 'errors-only',
  });
}

///////////////////////////////////////////////////////// default shit
// https://webpack.js.org/configuration/stats/
const compileStatsOpts = {
  // assetsSort: 'id',
  // cached: false,
  // moduleAssets: false,
  // modulesSpace: 15,
  assets: true,
  assetsSpace: 15,
  builtAt: true,
  cachedModules: true,
  errorDetails: true,
  errors: true,
  errorsCount: true,
  errorStack: true,
  groupAssetsByChunk: false,
  hash: true,
  outputPath: true,
  publicPath: true,
  runtimeModules: true,
  stats: true,
  timings: true,
  warnings: true,
  warningsCount: true,
  entrypoints: true,
};

// https://webpack.js.org/configuration/watch/#watchoptions
const watchingOpts = {
  ignored: ['/node_modules/**', '\.babelrc*', 'main\.js$'],
  aggregateTimeout: 600,
  poll: undefined,
};

/////////////////////////////////////// nodejs support
// need to track servers
const servers = new Map();
const launchAndLoadServer = (outputFilePath, clientConfig) => {
    // need to load file to figure out if we need to run and track a server
    const newModule = require(outputFilePath);

    // only tracking servers
    if (newModule.default?.isServer)
      servers.set(outputFilePath, newModule.default);

    // exit if no additional process required
    if (!clientConfig || !newModule.default?.app) return;

    const app = newModule.default.app;

    if (!app) throw 'cannot attach client app to BFF';

    const compiler = webpack(clientConfig);
    const middleware = createWebpackMiddleware(
      compiler,
      clientConfig.output.publicPath,
    );
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));

    // console.log('\n\n app keys', app._router.stack[5])
}

const reloadServer = (outputFilePath, clientConfig) => {
  const server = servers.get(outputFilePath).server;

  // https://nodejs.org/api/net.html#net_server_close_callback
  server.close?.(() => launchAndLoadServer(outputFilePath, clientConfig));
}

const getFilePath = (info, name) => info.outputPath + '/' + name;

const runCompilationFiles = (compileInfo, clientConfig) => {
  compileInfo.assets.forEach(asset => {
    // ignore non js files
    if (!asset.name.endsWith('.js')) return;

    const outputFilePath = getFilePath(compileInfo, asset.name);
    console.log('\n\n loading file', outputFilePath);


    // delete so we can import new version
    if (outputFilePath in require.cache) delete require.cache[outputFilePath];


    // (re)load servers
    if (servers.has(outputFilePath)) reloadServer(outputFilePath, clientConfig);
    else launchAndLoadServer(outputFilePath, clientConfig);
  });
}

const watchingCb = (err, stats, clientConfig) => {
  if (err) {
    console.log('\n\n webpack error occured\n\n', err.stack || err);
    if (err.details) console.log(err.details);

    // TODO: close watching and ... ?
    return;
  }

  const compileInfo = stats.toJson(compileStatsOpts);

  if (stats.hasErrors())
    console.log('\n\n compilation error occured\n\n', compileInfo.errors);
  if (stats.hasWarnings())
    console.log('\n\n compilation warnings exist\n\n', compileInfo.warnings);

  // console.log('\n\n compilation stats\n\n', Object.keys(compileInfo));
  // console.log('\n\n asset info', compileInfo.assets);


  runCompilationFiles(compileInfo, clientConfig);
};

const watchAndRun = ({
  clientConfig, // only used when adding to BFF
  config,
  opts = watchingOpts,
  cb = watchingCb,
}) => {
  const compiler = webpack(config);
  const watching = compiler.watch(opts, (e, s) => cb(e, s, clientConfig ));
};

const build = ({
  clientConfig, // only used when adding to BFF
  config,
}) => {
  const confs = [config];
  if (clientConfig) confs.push(clientConfig)

  webpack(confs, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }


  });
}

const run = (opts) => {
  switch (process.env.NODE_ENV) {
    case 'production': {
      build(opts);

      break;
    }

    default: {
      watchAndRun(opts);

      break;
    }
  }
}
module.exports = {
  build,
  compileStatsOpts,
  launchAndLoadServer,
  reloadServer,
  run,
  runCompilationFiles,
  servers,
  watchAndRun,
  watchingOpts,
}
