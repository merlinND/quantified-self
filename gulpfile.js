'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');

var paths = {
  js: {
    all: ['gulpfile.js', 'web/js/**', 'src/**/*.js'],
    entryPoints: ['web/js/index.js']
  },
  target: 'web/dist/',
  // Files to be included in the final package
  package: ['dist/**', 'res/**', 'views/**', 'manifest.json']
};

// JS compiling
gulp.task('browserify', function() {
  return gulp.src(paths.js.entryPoints)
    .pipe(browserify({
      debug: true,
      insertGlobals: false
    }))
    .pipe(gulp.dest(paths.target));
});

// Auto-run tasks on file changes
gulp.task('watch', function() {
  gulp.watch(paths.js.all, ['browserify']);
});

// Run main tasks on launch
gulp.task('default', ['browserify', 'watch'], function() {
});
