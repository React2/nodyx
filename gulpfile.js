'use strict';

var gulp = require('gulp'),
    bower = require('gulp-bower'),
    notify = require('gulp-notify'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('bower', function () {
    return bower('/bower_components');
});

gulp.task('jscs', function() {
    gulp.src('*.js')
        .pipe(jscs())
        .pipe(notify({
            title : 'JSCS',
            message : 'JSCS Passed. Let it fly!'
        }));
});

gulp.task('lint', function() {
    gulp.src('*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(notify({
            title : 'JSHint',
            message : 'JSHint Passed. Let it fly!'
        }));
});

gulp.task('mocha:nepl', function () {
    gulp.src('nepl/test/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('test', ['mocha:nepl']);

gulp.task('default', ['bower', 'jscs', 'lint']);
