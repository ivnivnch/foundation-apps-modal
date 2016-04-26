var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('server',['build'], function() {
    return gulp.src(['demo','node_modules','dist','node_modules/foundation-apps/js/angular/'])
        .pipe($.webserver({
            port: 8080,
            livereload: true,
            open:true
        }));
});

gulp.task('build', function(){
    return gulp.src(['src/**/*.js'])
        .pipe($.angularFilesort())// With srcs.name + '.tpl.js' for the templates, this makes sure templates are included after other sources.
        .pipe($.concat('foundation-apps-modal.js'))
        .pipe($.wrap('\'use strict\';\n\n<%= contents %>\n\n'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default',  ['build']);