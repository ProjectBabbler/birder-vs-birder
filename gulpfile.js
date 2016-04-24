var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var babel = require('gulp-babel');

gulp.task('build', ['compile-js']);
gulp.task('heroku:production', ['webpack', 'compile-js']);

gulp.task('compile-js', () => {
    return gulp.src('./react/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./bin/react'));
});

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

gulp.task('watch', () => {
    gulp.watch(['./react/**'], ['compile-js']);
});
