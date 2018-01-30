/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2011-2014 Webcomm Pty Ltd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Load plugins
var
    gulp = require('gulp'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    imageop = require('gulp-image-optimization'),
    pngquant = require('imagemin-pngquant'),
    rename = require("gulp-rename"),
    argv = require('yargs').argv;

const webp = require('gulp-webp');

var config = {

    // If you do not have the live reload extension installed,
    // set this to true. We will include the script for you,
    // just to aid with development.
    appendLiveReload: false,

    // Should CSS & JS be compressed?
    minifyCss: false,
    uglifyJS: false,
    minifyImages: false

};
console.log(argv.production);

var isProduction = typeof(argv.production) !== 'undefined';

if(isProduction){
    config.minifyCss = true;
    config.uglifyJS = true;
    config.minifyImages = true;
    console.log(config.minifyCss);
}


var liveReload = typeof(argv.livereload) !== 'undefined';

if(liveReload){
    config.appendLiveReload = true;
    console.log("live");
    console.log(config.appendLiveReload);
}

// CSS
gulp.task('css', function () {
    var stream = gulp
        .src('src/less/style.less')
        .pipe(less().on('error', notify.onError(function (error) {
            return 'Error compiling LESS: ' + error.message;
        })))
        .pipe(gulp.dest('css'));

    if (config.minifyCss === true) {
        stream.pipe(minifycss());
    }

    // Move some files to CSS folder
    gulp.src('src/less/justcopy/*').pipe(gulp.dest('css'));

    return stream
        .pipe(gulp.dest('css'))
        .pipe(notify({message: 'Successfully compiled LESS'}));
});

// JS
gulp.task('js', function () {
    var scripts = [
        // 'bower_components/jquery-ui/jquery-ui.js',
        // 'bower_components/bootstrap/js/transition.js',
        // 'bower_components/bootstrap/js/collapse.js',
        // 'bower_components/bootstrap/js/carousel.js',
        // 'bower_components/bootstrap/js/dropdown.js',
        // 'bower_components/bootstrap/js/modal.js',
        // 'bower_components/bootstrap/js/tab.js',
        'src/js/navs.js',
        'src/js/script.js',
        // 'src/js/checkout.js',
        // 'src/js/overlay.js',
        // 'src/js/inspirations.js',
        // 'src/js/rma.js',
        // 'src/js/products.js',
        // 'src/js/jquery.elevateZoom-3.0.8.min.js',
        // 'src/js/jquery.kapten.productCarousel.js',
        // 'src/js/jquery.matchHeight.js',
        'src/js/slick.js'
    ];

    if (config.appendLiveReload === true) {
        scripts.push('src/js/livereload.js');
    }

    var stream = gulp
        .src(scripts)
        .pipe(concat('script.js'));

    if (config.uglifyJS === true) {
        stream = stream.pipe(uglify());
    }

    // move bundle.js
    bundle = gulp.src('src/js/filter.js').pipe(gulp.dest('js'));
    gulp.src('src/js/scommerce/jquery.cookie.js').pipe(gulp.dest('js'));
    gulp.src('src/js/jquery-2.2.4.min.js').pipe(gulp.dest('js'));
    gulp.src('src/js/no-conflict.js').pipe(gulp.dest('js'));

    return stream
        .pipe(gulp.dest('js'))
        .pipe(notify({ message: 'Successfully compiled JavaScript' }));
});

// Images
gulp.task('images', function () {
    var stream = gulp.src('src/images/**/*');

    if(config.minifyImages){
        stream = stream.pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))

        /*
        .pipe(imageop({
                optimizationLevel: 6,
                progressive: true,
                interlaced: true
            }))
         */


    }
    stream = stream.pipe(gulp.dest('images'));

    return stream;

    // .pipe(notify({message: 'Successfully processed image'}));


});

gulp.task('images-webp', function () {
    var stream = gulp.src('src/images/**/*.{jpg,png}');

    var extname = "";

    if(config.minifyImages){
        stream = stream.pipe(rename(function (path) {
            extname = path.extname
        })).pipe(webp()).pipe(rename(function (path) {
            path.extname = extname + ".webp"
        }))
        stream = stream.pipe(gulp.dest('images'));
    }


    return stream;

    // .pipe(notify({message: 'Successfully processed image'}));
    /*.pipe(imagemin({
     progressive: true,
     svgoPlugins: [{removeViewBox: false}],
     use: [pngquant()]
     })) */

});

// Fonts
gulp.task('fonts', function () {
    return gulp
        .src([
            'bower_components/bootstrap/fonts/**/*',
            'bower_components/font-awesome/fonts/**/*',
            'src/fonts/**/*'
        ])
        .pipe(gulp.dest('fonts'));
    // .pipe(notify({message: 'Successfully processed font'}));
});

// Rimraf
gulp.task('rimraf', function () {
    return gulp
        .src(['css', 'js', 'images'], {read: false})
        .pipe(rimraf());
});

// Default task
gulp.task('default', ['rimraf'], function () {
    gulp.start('css', 'js', 'images', 'images-webp', 'fonts');
});

// Watch
gulp.task('watch', function () {
    config.appendLiveReload = true;

    // Watch .less files
    gulp.watch('src/less/**/*.less', ['css']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['js']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch fonts
    gulp.watch('bower_components/bootstrap/fonts/**/*', ['fonts']);

    livereload.listen();

    // Watch any files in , reload on change
    gulp.watch([
        'css/style.css',
        'js/script.js',
        'images/**/*',
        'fonts/**/*',
    ]).on('change', function (file) {
        setTimeout(function() {
            livereload.changed(file.path);
        }, 1000);

    });

});
