const {src, dest, watch, parallel, series} = require('gulp');
const scss 					= require('gulp-sass')(require('sass'));
const concat 				= require('gulp-concat');
const babel   	    = require('gulp-babel');
const browserSync		= require('browser-sync').create();
const uglify 			 	= require('gulp-uglify-es').default;
const autoprefixer	= require('gulp-autoprefixer');
const imagemin 			= require('gulp-imagemin');
const del 					= require('del');
const pug 					= require('gulp-pug');
const webp					= require('gulp-webp');
const sourcemaps  	= require('gulp-sourcemaps');
const dependents 		= require('gulp-dependents');
const cached 				= require('gulp-cached');

function browsersync (){
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		port: 2223
	});
};

// function convertImageToWEBP () {
// 	return (['app/images/**/*.png', 'app/images/**/*.jpg', 'app/images/**/*.jpeg'])
// 	.pipe(webp())
// 	.pipe(dest('dist/'))
// }

function cleanDist(){
	return del('dist')
}

function videoDist() {
	return src('app/videos/**/*')
	.pipe(dest('dist/videos'))
}

function images(){
 return src('app/images/**/*')
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 75, progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
	.pipe(dest('dist/images'))
}

function scripts(){
	return src([
		'node_modules/jquery/dist/jquery.js',
		// 'node_modules/bootstrap/dist/js/bootstrap.js', // uncomment only use bootstrap
		'app/js/*.js', 
		'!app/js/main.min.js'
	])
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
};

function pugToHTML () {
  // return src(['./app/**/*.pug', '!app/pug/sections/*.pug'])
  return src(['./app/*.pug'])
    .pipe(
      pug({
        doctype: 'html',
        pretty: true
      })
    )
    .pipe(dest('./app'));
};

function styles() {
		return src('app/scss/**/*.scss')
		.pipe(cached('scss'))
    .pipe(dependents())
		.pipe(sourcemaps.init())
		.pipe(scss({outputStyle: 'expanded'}).on('error', scss.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 15 version'],
			grid: true,
		}))
		.pipe(sourcemaps.write('.'))
		// .pipe(concat('style.min.css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
};

function dist(){
	return src([
		'app/css/style.css',
		'app/fonts/**/*',
		'app/js/main.js',
		'app/**/*.html',
		'app/videos/**.*',
	], {base: 'app'})
	.pipe(dest('dist'))
}

function watching () {
		watch(['app/scss/**/*.scss'], styles);
		watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
		watch(['app/*.html']).on('change', browserSync.reload);
		watch(['app/**/*.pug']).on('change', browserSync.reload);
		watch(['app/**/*.pug'], pugToHTML);
};

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.pugToHTML = pugToHTML;
exports.default = parallel(styles, scripts, browsersync, watching);
exports.build = series(cleanDist, styles, scripts, pugToHTML, dist);
exports.images = images;
exports.cleandist = cleanDist;