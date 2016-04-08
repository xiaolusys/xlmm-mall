
## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Development](#development)
- [Build](#build--buildproduction)

## About
- [React](https://github.com/facebook/react)
- [Redux](https://github.com/gaearon/redux)
- [React Router](https://github.com/rackt/react-router)
- [Bootstrap-loader](https://github.com/shakacode/bootstrap-loader) (configurable with .bootstraprc)
- Sass modules ([sass-loader](https://github.com/jtangelder/sass-loader) [css-loader](https://github.com/webpack/css-loader) [style-loader](https://github.com/webpack/style-loader))
- [react transform](https://github.com/gaearon/react-transform)
- [redux-logger](https://github.com/fcomb/redux-logger)
- [react-document-meta](https://github.com/kodyl/react-document-meta)
- [redux-form](https://github.com/erikras/redux-form)
- [karma](https://github.com/karma-runner/karma)
- [mocha](https://github.com/mochajs/mocha)

## Installation
```
$ git clone ssh://git@dev.huyi.so:10022/xiaolumm/xlmm-mall.git
$ cd xlmm-mall
$ npm install
```

## Development
```
$ npm start
```
Runs the project in development mode with hot-reloading of `src` folder.
Open your browser at [http://localhost:7070](http://localhost:7070).

## Clean
```
$ npm run clean
```
Using rimraf clean the `dist` folder, which is the target of the `build`

## Build & build:production
```
$ npm run build
```
Builds the app into the 'dist' folder for deployment
```
$ npm run build:production
```
## Run karma
```
$ npm test
```