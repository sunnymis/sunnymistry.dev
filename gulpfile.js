var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
const child = require('child_process');

const siteRoot = '_site';
const cssFiles = 'css/**/*.?(s)css';

gulp.task('jekyll', function() {
    child.spawn('jekyll', ['serve', '--watch']);
});

gulp.task('serve', function() {
    browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
        baseDir: siteRoot
    }
});

});

gulp.task('build', ['jekyll', 'serve']);
