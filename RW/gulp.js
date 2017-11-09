const os = require('os');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const header = require('gulp-header');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const webpack = require('gulp-webpack');
const zip = require('gulp-zip');

const projectConfig = require('./config.json');

const drive = {window: projectConfig.drive.window, mac: projectConfig.drive.mac};
const sass_output = projectConfig.sass_output;
const year = projectConfig.year;
const category = projectConfig.category;
const folder = projectConfig.folder;
const game = projectConfig.game;
const ui_static = /^win/.test(process.platform) ? `${drive.window}/promo/${game}` : `${drive.mac}/promo/${game}`;
const Path = {
    local: `${__dirname}/${category}/${year}/${folder}`,
    local_src_sass: `${__dirname}/${category}/${year}/${folder}/_src/sass`,
    local_src_js: `${__dirname}/${category}/${year}/${folder}/_src/js`,

    local_css: `${__dirname}/${category}/${year}/${folder}/css`,
    local_js: `${__dirname}/${category}/${year}/${folder}/js`,
    local_img: `${__dirname}/${category}/${year}/${folder}/img`,

    static_src_sass: `${ui_static}/${category}/${year}/${folder}/_src/sass`,
    static_src_js: `${ui_static}/${category}/${year}/${folder}/_src/js`,
    static_css: `${ui_static}/${category}/${year}/${folder}/css`,
    static_js: `${ui_static}/${category}/${year}/${folder}/js`,
    static_img: `${ui_static}/${category}/${year}/${folder}/img`
};
const autoprefixer_browsers = ['last 4 version', 'not IE 8'];

function banner(){
    let date = new Date();
    return [
        '/**',
        ` * @project: ${projectConfig.name}`,
        ` * @author: ${projectConfig.author}`,
        ' * @update : ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        ' */', ''
    ].join('\n');
}

/**
 * gulp task
 *
 */
gulp.task('start', () =>{
    let allCopy = () =>{
        gulp.src(`${Path.local}/**/*`)
            .pipe(gulp.dest(`${ui_static}/${category}/${year}/${folder}`));
    };

    let jsCompile = () =>{
        if(projectConfig.es6){
            gulp.src(`${Path.local_src_js}/**/*.js`)
                .pipe(webpack(require('./webpack.config.js')))
                .pipe(gulp.dest(Path.local_js))
        } else{
            gulp.src(`${Path.local_src_js}/**/*.js`)
                .pipe(sourcemaps.init())
                .pipe(uglify({comments: false}))
                .pipe(header(banner()))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(Path.local_js))
        }
    };

    let sassCompile = () =>{
        gulp.src(`${Path.local_src_sass}/**/*.scss`)
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: sass_output}).on('error', sass.logError))
            .pipe(autoPrefixer(autoprefixer_browsers))
            .pipe(header(banner()))
            .pipe(sourcemaps.write(`.`))
            .pipe(gulp.dest(Path.local_css));
    };

    gulp.watch([`${Path.local_src_js}/**/*.js`], jsCompile);
    gulp.watch([`${Path.local_src_sass}/**/*.scss`], sassCompile);
    gulp.watch([`${category}/${year}/${folder}/**/*`, `!node_modules{,/**/*}`], (e) =>{
        console.log(e.type + ': ' + e.path);

        let fileName = path.basename(e.path);
        let fileRoot = ui_static + e.path.split(__dirname).pop().replace(fileName, '');

        if(e.type === 'deleted'){
            let url = `${fileRoot}/${fileName}`;
            fs.access(url, fs.constants.R_OK | fs.constants.W_OK, (err) =>{
                if(err) return;
                fs.unlinkSync(url);
            });
            return;
        }

        gulp.src(e.path)
            .pipe(gulp.dest(fileRoot));
    });

    allCopy();
    jsCompile();
    sassCompile();
});

gulp.task('image => optimize', () =>{
    return gulp.src([`${Path.local_img}/**/*`, `!${Path.local_img}/optimize`])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(`${Path.local_img}/optimize`));
});

gulp.task('zip => 바탕화면', () =>{
    let home = os.homedir();
    return gulp.src([`${Path.local}/**/*`, `!${Path.local}/_src{,/**/*}`])
        .pipe(zip(`${folder}.zip`))
        .pipe(gulp.dest(`${home}/Desktop`));
});