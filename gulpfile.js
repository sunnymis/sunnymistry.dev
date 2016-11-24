var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .on('error', onError)
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('buildCSS',['sass'], function() {
    return gulp.src('src/css/**/*.css')
        .pipe(concat('style.min.css'))
        .on('error', onError)
        .pipe(gulp.dest('src/'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('watch', ['buildCSS','browserSync'], function () {
    gulp.watch('src/scss/**/*.scss', ['buildCSS']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync.init({
        injectChanges: true,
       server: {
           baseDir: 'src'
       }
    });
});

gulp.task('default',['watch']);

function onError(err) {
    console.log(err);
    this.emit('end');
}
