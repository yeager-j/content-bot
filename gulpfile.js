const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const exec = require('gulp-exec');
const del = require('del');

// Build scripts
gulp.task('build', () =>
    gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
);

// Clean built scripts
gulp.task('clean', () => del('dist/**'));

// Clean then build
gulp.task('rebuild', gulp.series('clean', 'build'));

// Commit & tag version
gulp.task('tag-release', () => {
    const version = require('./package.json').version;
    return gulp.src('.')
        .pipe(exec(`git commit -am "Prepare ${version} release"`))
        .pipe(exec(`git tag v${version}`))
        .pipe(exec(`git push origin : v${version}`));
});

// Commit & tag and publish to NPM
gulp.task('publish', gulp.parallel(gulp.series('rebuild', 'tag-release', () =>
    gulp.src('.')
        .pipe(exec('npm publish'))
)));

gulp.task('default', gulp.parallel('rebuild'));