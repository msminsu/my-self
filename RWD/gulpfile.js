const os = require('os');
const gulp = require('gulp');
const header = require('gulp-header');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const autoPrefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const zip = require('gulp-zip');
const promoConfig = require('./promo.config');

const useWebpack = promoConfig.options.webpack;
const useUglify = promoConfig.options.uglifyJs;
const ui_static = /^win/.test(process.platform) ? `//ui-static/wwwroot/promo/bns/rollbook` : `/Volumes/wwwroot/promo/bns/rollbook`;

const autoprefixer_browsers = ['last 4 version', 'not IE 8'];
const projectName = __dirname.split('/').pop();
const home = os.homedir();

const Path = {
    local: `${__dirname}`,
    local_src_sass: `${__dirname}/_src/sass`,
    local_src_js: `${__dirname}/_src/js`,
    local_css: `${__dirname}/css`,
    local_js: `${__dirname}/js`,

    ui_static_css: `${ui_static}/${projectName}/css`,
    ui_static_js: `${ui_static}/${projectName}/js`
};

const sassList = ((sass = promoConfig.entry.sass) => {
    if (!sass) {
        return;
    }

    if (sass === '*') {
        return `${Path.local_src_sass}/**/*.scss`;
    }

    if (typeof sass === 'string') {
        return [`${Path.local_src_sass}/${sass}`, `${Path.local_src_sass}/module/**/*`, `${Path.local_src_sass}/util/**/*`, `${Path.local_src_sass}/vendor/**/*`];
    }

    if (Array.isArray(sass)) {
        let list = [];

        sass.forEach((file) => {
            list.push(`${Path.local_src_sass}/${file}`);
        });

        list.push(`${Path.local_src_sass}/util/**/*`);
        list.push(`${Path.local_src_sass}/vendor/**/*`);

        return list;
    }
})();

const jsList = ((js = promoConfig.entry.js) => {
    if (!js) {
        return;
    }

    let list = [];

    if (js === '*') {
        return `${Path.local_src_js}/**/*.js`;
    }

    if (typeof js === 'string') {
        return `${Path.local_src_js}/${js}`;
    }

    js.forEach((file) => {
        list.push(`${Path.local_src_js}/${file}`);
    });

    return list;
})();

const banner = () => {
    let date = new Date();
    return [
        '/**',
        ` * @project: ${projectName}`,
        ` * @author: NCSOFT`,
        ' * @update : ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        ' */', ''
    ].join('\n');
};

gulp.task('watch start', () => {
    let compileJs = () =>{
        if(useWebpack) {
            gulp.src(jsList)
                .pipe(webpack(require('./webpack.config.js')))
                .pipe(gulp.dest(Path.local_js))
                .pipe(gulp.dest(Path.ui_static_js));
        } else {
            if(useUglify) {
                gulp.src(jsList)
                    .pipe(sourcemaps.init())
                    .pipe(uglify({comments: false}))
                    .pipe(header(banner()))
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(Path.local_js))
                    .pipe(gulp.dest(Path.ui_static_js));
            } else {
                gulp.src(jsList)
                    .pipe(sourcemaps.init())
                    .pipe(header(banner()))
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(Path.local_js))
                    .pipe(gulp.dest(Path.ui_static_js));
            }
        }
    };

    let compileSass = () => {
        gulp.src(sassList)
            .pipe(sourcemaps.init())
            .pipe(header(banner()))
            .pipe(sass({outputStyle: promoConfig.options.sassOutputStyle}).on('error', sass.logError))
            .pipe(autoPrefixer(autoprefixer_browsers))
            .pipe(sourcemaps.write(`.`))
            .pipe(gulp.dest(Path.local_css))
            .pipe(gulp.dest(Path.ui_static_css));
    };

    if (promoConfig.entry.js) {
        watch(jsList, compileJs);
        compileJs();
    }

    if (promoConfig.entry.sass) {
        watch(sassList, compileSass);
        compileSass();
    }

    watch(`${Path.local}/_src/**/*`, (e) => {
        console.log(`${e.event}: ${e.path.split('/').pop()}`);
    });
});

gulp.task('ZIP => Desktop', () => {
    return gulp.src([`${Path.local}/**/*`, `!${Path.local}/_src{,/**/*}`])
               .pipe(zip(`${projectName}.zip`))
               .pipe(gulp.dest(`${home}/Desktop`));
});