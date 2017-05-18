"use strict"
const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const useref = require('gulp-useref')
const cssnano = require('gulp-cssnano')
const gulpIf = require("gulp-if")
const uglify = require("gulp-uglify")
const imagemin = require("gulp-imagemin")
const cache = require("gulp-cache")
const del = require("del")
const runSequence = require("run-sequence")

gulp.task('sass', () => {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
})

gulp.task('useref', () => {
    return gulp.src("app/*.html")
        .pipe(useref())
        .pipe(gulpIf("*.js", uglify()))
        .pipe(gulpIf("*.css", cssnano()))
        .pipe(gulp.dest('dist'))
})

gulp.task("images", () => {
    return gulp.src("app/images/**/*.+(png|jpg|gif|svg)")
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', () => {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', () => {
    return del.sync('dist')
})

gulp.task('cache:clear', (callback) => {
    return cache.clearAll(callback)
})

gulp.task('watch', () => {
    gulp.watch("app/scss/**/*.scss", ['sass'])
    gulp.watch("app/css/**/*.css", ['useref'])
    gulp.watch("app/js/**/*.js", ['useref'])
    gulp.watch('app/js/**/*.js', browserSync.reload)
    gulp.watch("app/*.html", browserSync.reload)
})

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
})

gulp.task('build', (callback) => {
    runSequence(
        'clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
})

gulp.task('default', function (callback) {
    runSequence(
        ['sass','browserSync', 'watch'],
        callback
    )
})