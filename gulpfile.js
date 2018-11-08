const gulp = require('gulp'),
      imagemin = require('gulp-imagemin'),
      uglify = require('gulp-uglify'),
      pump = require('pump'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      browserSync = require('browser-sync');

/*
    --  TOP LEVEL FUNCTIONS
    gulp.task - Define tasks
    gulp.src - Point to files to use
    gulp.dest - Point to folder to output
    gulp.watch - Watch files and folders for change
*/

//Browser Sync
gulp.task('browser-sync', function(){
    browserSync({
        server: 'dist',
        notify: false
    });
});

//Minify images
gulp.task('minimg', function(){    
     gulp.src('src/img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'))
});

//Concat JS
gulp.task('scripts', function(){
    return gulp.src(['src/js/data.js', 'src/js/app.js']) 
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}))
});

//Compile Sass
gulp.task('sass', function(){
    return gulp.src('src/**/*.+(scss|sass)')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('default', ['minimg', 'scripts', 'sass'])

gulp.task('watch', ['browser-sync', 'sass', 'scripts', 'minimg'], function(){
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/img/**/*', ['minimg']);
    gulp.watch('src/styles/*.scss', ['sass']);
});
