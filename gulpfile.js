/**
 * Created by keke on 14-11-05.
 */

var gulp = require('gulp')
  , minifyCSS = require('gulp-minify-css')
  , uglify = require('gulp-uglify')

gulp.task('build', function() {
  var dist = './public/dist/'

  gulp.src('./public/*/*.css')
    .pipe(minifyCSS({keepBreaks: false}))
    .pipe(gulp.dest(dist))

  gulp.src('./public/*/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(dist))
})
