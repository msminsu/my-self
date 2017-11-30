// Modules 호출
var gulp = require('gulp'); // Gulp 모듈 호출

var sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    config = require('./config.json');


var category = config.category;
var sass_output = config.sass_output;
var folder = config.folder;

var paths = {
    local_sass: folder+'/_src/sass/**/*.scss',
    local_css: folder+'/css'
};

gulp.task('start',function(){

    var sassCompile =function(){
        gulp
            .src(paths.local_sass)
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle:sass_output}).on('error',sass.logError))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.local_css));

    };

    gulp.watch([paths.local_sass],sassCompile);



});
