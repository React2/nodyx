'use strict';

var gulp = require('gulp'),
    bower = require('gulp-bower');

gulp.task('bower', function () {
    return bower('/bower_components');
});

gulp.task('default', ['bower']);
