'use strict'
const log = require('logger')
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

const bullMonitor = require('./bull');

const PORT = +process.env.PORT || 3000
let server
app.use(cookieParser());
app.use(bodyParser.json({
  limit: '1000MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}));
app.use(compression());
const init = async()=>{
  try{
    await bullMonitor.start();
    start();
  }catch(e){
    log.error(e);
    setTimeout(init, 5000);
  }
}
const start = ()=>{
  try{
    app.use('/', bullMonitor.router)
    server = app.listen(PORT, ()=>{
      log.info(`bull monitor is listening on ${server.address().port}`)
    })
  }catch(e){
    log.error(e);
    setTimeout(start, 5000)
  }
}
init()
