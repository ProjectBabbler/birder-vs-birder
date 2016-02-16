var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');

gulp.task('default', ['webpack']);

gulp.task('webpack', (callback) => {
    webpack(require('./webpack.config.prod.js'), (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({
            chunkModules: false,
        }));
        callback();
    });
});
