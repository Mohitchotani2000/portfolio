var gulp = require('gulp');
var plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass')); // Ensure you are using the latest Sass
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create(); // Import Browser-Sync

// Scripts task
gulp.task('scripts', function() {
    return gulp.src('./js/scripts.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(babel({
            presets: [['@babel/env', {modules:false}]]
        }))
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream()); // Stream changes to Browser-Sync
});

// Styles task
gulp.task('styles', function () {
    return gulp.src('./scss/styles.scss')
        .pipe(wait(250))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream()); // Stream changes to Browser-Sync
});

// Serve task
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './' // Change this to your project root directory if necessary
        }
    });

    // Watch files
    gulp.watch('./js/scripts.js', gulp.series('scripts'));
    gulp.watch('./scss/styles.scss', gulp.series('styles'));
    gulp.watch('./*.html').on('change', browserSync.reload); // Watch HTML files
});

// Default task
gulp.task('watch', gulp.series('scripts', 'styles', 'serve')); // Combine watch and serve
