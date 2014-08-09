var   package  = require('./package')
    , gulp     = require('gulp')
    , gutil    = require('gulp-util')
    , nodemon  = require('gulp-nodemon')
    , jshint   = require('gulp-jshint')
    , stylish  = require('jshint-stylish')
    , clean    = require('gulp-clean')
    , concat   = require('gulp-concat')
    , uglify   = require('gulp-uglify')
    , rename   = require('gulp-rename')
    , minify   = require('gulp-minify-css')
    , bower    = require('gulp-bower');

var filename = {};
filename.vendor = 'vendor';
filename.custom = package.name;

var bases = {};
bases.dist = 'public/dist/';
bases.fonts = 'public/fonts/';

var files = {};
files.backend = ['*.js', 'routes/*.js'];

files.vendor = {};
files.vendor.javascript = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-socket-io/socket.js',
    'bower_components/Autolinker.js/dist/Autolinker.js',
    'bower_components/notifyjs/dist/notify.js',
    'bower_components/notifyjs/dist/styles/bootstrap/notify-bootstrap.js',
    'bower_components/modernizr/modernizr.js',
    'bower_components/foundation/js/foundation.js',

];
files.vendor.css = [
    'bower_components/foundation/css/foundation.css',
    'bower_components/font-awesome/css/font-awesome.css',
];
files.vendor.fonts = [
    'bower_components/font-awesome/fonts/*',
];

files.custom = {};
files.custom.css = [
    'public/css/foundation.css',
];

gulp.task('default', [
    'lint',
    'dist-clean',
    'font-clean',
    'custom',
    'vendor'
    ], function () {
    gulp.start('develop');
});

gulp.task('default', ['lint'], function() {
    gulp.start('develop');
});

gulp.task('font-clean', function () {
    return gulp.src(bases.fonts, {read: false})
        .pipe(clean({force: true}))
        .on('error', gutil.log);
});

gulp.task('dist-clean', function () {
    return gulp.src(bases.fonts, {read: false})
        .pipe(clean({force: true}))
        .on('error', gutil.log);
});

gulp.task('vendor',['dist-clean', 'font-clean'], function () {
    gulp.src(files.vendor.javascript)
        .pipe(concat(filename.vendor + '.js'))
        .pipe(gulp.dest(bases.dist))
        .pipe(uglify())
        .pipe(rename(filename.vendor + '.min.js'))
        .pipe(gulp.dest(bases.dist))
        .on('error', gutil.log);

    gulp.src(files.vendor.css)
        .pipe(concat(filename.vendor + '.css'))
        .pipe(gulp.dest(bases.dist))
        .pipe(rename(filename.vendor + '.min.css'))
        .pipe(minify())
        .pipe(gulp.dest(bases.dist))
        .on('error', gutil.log);

    gulp.src(files.vendor.fonts)
        .pipe(gulp.dest(bases.fonts));
});

gulp.task('custom', function() {
    gulp.src(files.custom.css)
        .pipe(concat(filename.custom + '.css'))
        .pipe(gulp.dest(bases.dist))
        .pipe(rename(filename.custom + '.min.css'))
        .pipe(minify())
        .pipe(gulp.dest(bases.dist))
        .on('error', gutil.log);
});

gulp.task('lint', function () {
    gulp.src(files.backend)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('develop', function() {
    nodemon({script: 'app.js', env:{'PORT': '8000'}, ignore: [bases.dist]})
        .on('change', ['lint', 'dist-clean', 'font-clean', 'custom', 'vendor'])
        .on('restart', function() {
            gutil.log('Restarting Node...');
        });
});

gulp.task('deploy', ['bower'], function() {
    gulp.start('lint', 'dist-clean', 'font-clean', 'custom', 'vendor');
});

gulp.task('bower', function() {
  return bower();
});