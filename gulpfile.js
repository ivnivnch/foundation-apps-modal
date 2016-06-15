var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
require('gulp-release-easy')(gulp);

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
    var src = gulp.src(['src/**/*.js'])
        .pipe($.angularFilesort())
        .pipe($.concat('foundation-apps-modal.js'))
        .pipe($.ngAnnotate())
        .pipe($.wrap('\'use strict\';\n\n<%= contents %>\n\n'));

    src.pipe(gulp.dest('dist'));

    src.pipe($.uglify())
        .pipe($.rename('foundation-apps-modal.min.js'))
        .pipe(gulp.dest('dist'));

    var standAlone = gulp.src(['dist/foundation-apps-modal.js'])
        .pipe($.rename('foundation-apps-modal.standalone.js'))
        .pipe($.replace('[\'foundation\']', '[]'));

    standAlone.pipe(gulp.dest('dist'));

    return standAlone.pipe($.uglify())
        .pipe($.rename('foundation-apps-modal.standalone.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['server'], function () {
    gulp.watch('src/**/*.js', ['build']);
});