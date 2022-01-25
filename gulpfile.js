const { src,dest,watch,series } = require('gulp')
// const sass = require('gulp-sass')
const sass = require('gulp-sass')(require('node-sass'))
const svgSprite = require('gulp-svg-sprites')
const image = require('gulp-image')
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')

    

function styles(cb) {
    return src('src/sass/style.scss')
        .pipe(sass({outputStyle: 'compact'}).on('error',sass.logError))
        .pipe(autoprefixer(
            ['last 4 versions']
        ))
        .pipe(dest('src/css'))
    cb();
}


function svg(cb) {
    return src('src/images/svg/*.svg')
    .pipe(svgSprite({
        mode: 'symbols',
        svg: {
            svgPath: "../svg/svg/%f"
        }
    }))
    .pipe(dest("src/svg"));

    cb();
}

const clean = async () => {
    return del.sync(['./public/']);
}

const compressImages = async () => {
    return src(
            [
                './src/images/examples/**/*',
                './src/images/plugs/**/*',
                './src/images/plugs/**/*',
                './src/images/bgs/**/*',
                './src/images/*.jpg',
                './src/images/*.jpeg',
                './src/images/*.png'
            ],
            {base: './src/images'}
        )
        .pipe(image())
        .pipe(dest('./public/images'));
};

const copyAll = async () => {
    return src(
        [   
            './src/images/svg/**/*',
            './src/images/*.svg',
            './src/css/**/*',
            './src/js/**/*',
            './src/fonts/**/*',
            './src/svg/**/*',
            './src/ajax/**/*',
            './src/*.html',
            './src/.htaccess',
        ],
        {base: './src'}
    )
    .pipe(dest('./public'));
}


exports.styles = styles;
exports.svg = svg;
exports.default = function() {
    watch('src/sass/**/*.scss', styles);
    watch('src/images/svg/*.svg', svg);
};

const buildSeries = series(clean,compressImages,copyAll)
exports.build = buildSeries;
