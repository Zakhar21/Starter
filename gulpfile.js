const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require("gulp-notify");
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');

const styles = () => {
    return src('./src/scss/**/*.scss') // Находим все файлы scss во всех папках
        .pipe(sourcemaps.init())

       .pipe(sass(
           {
               outputStyle: 'expanded'
           }
       ).on('error', notify.onError()))

       .pipe(rename(
           {
               suffix: '.min'
           }
        ))

        .pipe(autoprefixer({
            cascade:false,
        }))

        .pipe(cleanCSS({
            level:2
        }))

       .pipe(sourcemaps.write('.'))

       .pipe(dest('./app/css/')) // Отправляем в эту папку
       .pipe(browserSync.stream());
}

const htmlInclude = () => {
    return src(['./src/index.html'])
    .pipe(fileinclude({
        prefix: '@',
        basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
}

const imgToApp = () => {
    return src(['./src/img/**.jpg', './src/img/**.jpeg', './src/img/**.png'])
        .pipe(dest('./app/img'))
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    watch('./src/scss/**/*.scss', styles);
    watch('./src/index.html', htmlInclude);
    watch('./src/img/**.jpg', imgToApp);
    watch('./src/img/**.jpeg', imgToApp);
    watch('./src/img/**.png', imgToApp);
}

















exports.styles = styles;
exports.watchFiles = watchFiles;

exports.default = series(htmlInclude, styles, imgToApp, watchFiles);