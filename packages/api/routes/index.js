'use strict';


import express from 'express';


const app = express();


app.get('/', (req, res) => {
  console.log('\n\n got request')
  res.send('yolo bitches')
});


// https://github.com/expressjs/express/blob/master/examples/multi-router/index.js
let server;
if (!module.parent) {
  server = app.listen(process.env.NIRV_API_PORT, () => console.log('\n\n api/routes/index.js', process.env.NIRV_API_PORT));
}


export default {app, server, isServer: true};
