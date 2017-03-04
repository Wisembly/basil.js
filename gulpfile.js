var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace');

gulp.task('default', function () {
    gulp.start('scripts');
});

gulp.task('scripts', ['default_scripts', 'es2015_src', 'es2015_min']);

gulp.task('default_scripts', function () {
    return gulp.src('src/basil.js')
        .pipe(gulp.dest('build'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('es2015_src', function () {
    return gulp.src('src/basil.js')
        .pipe(rename({ suffix: '.es2015' }))
        .pipe(replace(/^(.|\n|\r)*?{\n/, ''))
        .pipe(replace(/window\.Basil =(.|\n|\r)*$/, 'export default Basil;'))
        .pipe(gulp.dest('build'));
});

gulp.task('es2015_min', function () {
    return gulp.src('src/basil.js')
        .pipe(rename({ suffix: '.es2015.min' }))
        .pipe(uglify()) // Uglify does not recognize ES2015 syntax.
        .pipe(replace(/^(.|\n|\r)*?var/, 'var'))
        .pipe(replace(/,window\.Basil=/, ';export default '))
        .pipe(replace(/(export default .)(.|\n|\r)*$/, '$1;'))
        .pipe(gulp.dest('build'));
});
