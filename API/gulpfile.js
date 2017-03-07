// Modules & Plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
var myth = require('gulp-myth');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var plumber = require('gulp-plumber');
var beeper = require('beeper');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

// Error Helper
function onError(err) {
    beeper();
    console.log(err);
}

// Styles Task
gulp.task('styles', function() {
    return gulp.src('app/css/*.css')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('all.css'))
        .pipe(myth())
        .pipe(gulp.dest('dist'));
});

// Scripts Task
gulp.task('scripts', function(cb) {
   return gulp.src(['app/js/*.js','!app/js/hello.js','!app/js/app.js'])
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist'));
});



// Clean Task
gulp.task('clean1', function (cb) {
   //del.sync(['dist']);
   //cb();
   del(['dist'], cb);
});

var promisedDel=require('promised-del');
gulp.task('clean2', function () {
  return promisedDel(['dist/']);

});

var Promise = require('promise');
var del = require('del');

gulp.task('clean3', function() {
  return new Promise(function (resolve, reject) {
    del(['dist'], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

// Default Task
gulp.task('default', gulp.series('clean1', 'styles', 'scripts'));

var companyTasks = require('./myCompanyTasksRegistry.js');

gulp.registry(companyTasks);

gulp.task('one', gulp.parallel('someCompanyTask', function(done) {
  console.log('in task one');
  done();
}));


gulp.task('api', function (done) {
    console.log(gulp.tree());
  console.log(gulp.lastRun('one'));
  done();

});


var gulpPrefixer = require('./gulp-prefixer');
gulp.task('buffer', function (done) {
return gulp.src('app/js/*.js')
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('modified-files'));
});

var gulpPrefixer2 = require('./gulp-prefixer2');
gulp.task('stream', function (done) {
return gulp.src('app/js/*.js', { buffer: false })
  .pipe(gulpPrefixer2('prepended string'))
  .pipe(gulp.dest('modified-files2'));
});

const mocha = require('gulp-mocha');
gulp.task('test', function (done) {
return gulp.src('test*.js', {read: false})
  .pipe(mocha({reporter: 'nyan'}))
});
