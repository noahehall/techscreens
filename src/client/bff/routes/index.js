'use strict';


import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const publicDir = process.env.appDist + '/ui/';

app.get('*', (req, res, next) => {
  if (req.url === '/__webpack_hmr') next();
  // auto send files ending with .XXXX
  else if (req.url.indexOf('.', -4) > -1) res.sendFile(publicDir + req.url)
  // send html file in all other cases as routing is handled in client
  else res.sendFile(publicDir + '/index.html')
});


// https://github.com/expressjs/express/blob/master/examples/multi-router/index.js
let server;
if (!module.parent) {
  server = app.listen(process.env.BFF_PORT, () => console.log('\n\n BFF running', process.env.BFF_PORT));
}


export default {app, server, isServer: true};
