'use strict';

// adds webpack dev middleware and webpack hot middleware
// to a running express server

import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';


function createWebpackMiddleware(compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    logLevel: 'warn',
    publicPath,
    silent: true,
    hot: true,
    stats: 'errors-only',
  });
}

export default function addDevMiddlewares(app, webpackConfig) {
  const compiler = webpack(webpackConfig);
  const middleware = createWebpackMiddleware(
    compiler,
    webpackConfig.output.publicPath,
  );
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });

  console.log('\n\n app keys', Object.keys(app))
};
