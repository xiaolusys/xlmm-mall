const gulp = require('gulp');
const clean = require('gulp-clean');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

const fontName = 'xlmm-font-awesome';
// var version = '1.0.0';

gulp.task('build', ['clean'], function() {
  gulp.src(['src/assets/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'src/assets/templates/_icons.scss',
      targetPath: '../_icons.scss',
      fontPath: 'fonts/',
      // version: version
    }))
    .pipe(iconfont({
      fontName: fontName,
      centerHorizontally: true,
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
    }))
    .pipe(gulp.dest('src/containers/App/styles/fonts'));
});

gulp.task('clean', function() {
  gulp.src('src/containers/App/styles/_icons.scss', {
      read: false,
    })
    .pipe(clean());
  gulp.src('src/containers/App/styles/xlmm-font-awesome.*', {
      read: false,
    })
    .pipe(clean());
});
