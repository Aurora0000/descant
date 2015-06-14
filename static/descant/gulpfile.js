var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var minifyCss = require('gulp-minify-css');
 
gulp.task('js', function () {
  gulp.src(['vendor/*.js', 'index.js', 'config.js', 'services/*.js', 'directives/*.js', 'controllers/*.js', 'filters/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});
