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
        .pipe(sass().on('error', errorHandler))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
})

const errorHandler = (err) => {
    console.error(err.toString())
    gulp.emit('end')
}

gulp.task('useref', () => {
    return gulp.src("app/*.html")
        .pipe(useref().on('error', errorHandler))
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

gulp.task('refresh', () => {
    runSequence('useref', browserSync.reload)
})

gulp.task('update', () => {
    runSequence('sass', 'useref', browserSync.reload)
})

gulp.task('watch', () => {
    gulp.watch("app/scss/**/*.scss", ['update'])
    gulp.watch("app/css/**/*.css", ['refresh'])
    gulp.watch("app/js/**/*.js", ['refresh'])
    gulp.watch("app/images/**/*.+(png|jpg|gif|svg)", runSequence('images', 'refresh'))
    gulp.watch("app/*.html", ['refresh'])
})

gulp.task('browserSync', () => {
    // browserSync.init({
    //     server: {
    //         baseDir: 'app'
    //     }
    // })
    browserSync.init({
		proxy: "http://localhost:3000"
	})
})

gulp.task('build', (callback) => {
    runSequence(
        'clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
})

gulp.task('default', (callback) => {
    runSequence(
        ['sass','browserSync', 'watch'],
        callback
    )
})