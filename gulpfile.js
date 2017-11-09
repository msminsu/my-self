// Modules 호출
var gulp = require('gulp'); // Gulp 모듈 호출

var sourcemaps = require('gulp-sourcemaps'),
    scss = require('gulp-sass'),
    config = = require('./config.json');


var src = 'src';
var dist = 'dist';
var paths = {scss: src +'/*.scss'};

//* Values : nested, expanded, compact , compressed
var scssOptions ={
    outputStyle:'compact',
    indentType:'tab',
    indentWidth:0,
    precision:6
};

gulp.task('combine-sass',function(){
    return gulp
    .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(scss(scssOptions).on('error',scss.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist+'/css'))

});

gulp.task('watch',function(){
     gulp.watch(paths.scss,['combine-sass']);
});

gulp.task('start',['watch']);