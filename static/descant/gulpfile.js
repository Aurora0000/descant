var gulp = require('gulp');
var rename = require('gulp-rename');
var include = require('gulp-include');
var concat = require('gulp-concat-util');
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');
var ngAnnotate = require('gulp-ng-annotate');
 
gulp.task('js', function () {
  //jQuery must be first, since Angular requires it.
  gulp.src(['vendor/jQuery.js', 'vendor/*.js', 'index.js', 'config.cpl.js', 'services/*.js', 'directives/*.js', 'controllers/*.js', 'filters/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify({output: {ascii_only: true }}))
    .pipe(gulp.dest('.'));
});

gulp.task('theme-setup', function() {
  gulp.src('templates/*/theme.json')
    .pipe(concat('themes.json', {sep: ',\n'}))
    .pipe(gulp.dest('.'));
});

gulp.task('lang-setup', function() {
  gulp.src('translations/definitions/*.json')
    .pipe(concat('langs.json', {sep: ',\n'}))
    .pipe(gulp.dest('.'));
});

gulp.task('update-config', function() {
  gulp.src('config.js')
    .pipe(include())
    .pipe(rename('config.cpl.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', gulpSequence(['lang-setup', 'theme-setup'], 'update-config', 'js'));