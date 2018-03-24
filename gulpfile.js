var gulp = require('gulp');
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
        gutil.log('[webpack]', stats.toString({
            chunkModules: false,
        }));
        callback();
    });
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['./react/**'], ['compile-js']);
});
