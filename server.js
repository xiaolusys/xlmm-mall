const Koa = require('koa');
const logger = require('koa-logger');
const sendfile = require('koa-sendfile');
const router = require('koa-router')();
const path = require('path');
const webpack = require('webpack');
const webpackDev = require('koa-webpack-dev-middleware');
const webpackHot = require('koa-webpack-hot-middleware');
const webpackConfig = require('./webpack/common.config');
const config = require('./config');

const compiler = webpack(webpackConfig);
const app = new Koa();

router.get('/', async(ctx) => {
  await sendfile(ctx, path.join(__dirname, '/index.html'));
});

app.use(logger());
app.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));
app.use(webpackHot(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}));
app.use(router.routes());

app.listen(7070);
