var gulp = require('gulp');
var rename = require('gulp-rename');
var include = require('gulp-include');
var concat = require('gulp-concat-util');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var minifyCss = require('gulp-minify-css');
 
gulp.task('js', function () {
  gulp.src(['vendor/*.js', 'index.js', 'config.cpl.js', 'services/*.js', 'directives/*.js', 'controllers/*.js', 'filters/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('theme-setup', function() {
  gulp.src('templates/*/theme.json')
    .pipe(concat('themes.json', {sep: ',\n'}))
    .pipe(gulp.dest('.'));
});

gulp.task('update-config', function() {
  gulp.src('config.js')
    .pipe(include())
    .pipe(rename('config.cpl.js'))
    .pipe(gulp.dest('.'));
});