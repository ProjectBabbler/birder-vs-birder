var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var babel = require('gulp-babel');

gulp.task('default', ['webpack', 'build']);

gulp.task('build', ['build-emails', 'build-shared']);

gulp.task('build-emails', () => {
    return gulp.src('./email/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./bin/email'));
});

gulp.task('build-shared', () => {
    return gulp.src('./shared/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./bin/shared'));
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
