'use strict';

var Koa = require('koa');
var route = require('koa-route');

var app = new Koa();

app.use(route.get('/', (ctx) => {
  ctx.body = 'hello';
}));

app.use(route.get('/error', (ctx) => {
  ctx.status = 500;
  ctx.body = 'Error';
}));

exports = module.exports = {
  app,
  start: function (port, callback) {
    app.listen(port, callback);
    this.start = (port, callback) => callback();
  }
}
