var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('server', ['build'], function () {
    return gulp.src(['demo', 'node_modules', 'dist',
        'node_modules/foundation-apps/js/angular/' // include url to modal template html
    ])
        .pipe($.webserver({
            port: 8080,
            livereload: true,
            open: true
        }));
});

gulp.task('build', function () {
    return gulp.src(['src/**/*.js'])
        .pipe($.angularFilesort())
        .pipe($.concat('foundation-apps-modal.js'))
        .pipe($.wrap('\'use strict\';\n\n<%= contents %>\n\n'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['server'], function () {
    gulp.watch('src/**/*.js', ['build']);
});