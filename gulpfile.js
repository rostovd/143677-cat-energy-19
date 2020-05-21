"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var webp = require("gulp-webp");
var rename = require("gulp-rename")
var svgstore = require("gulp-svgstore");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');

var del = require("del");

var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task('compress', function () {
  return gulp.src("source/js/**/*.js")
    .pipe(uglify(/* options */))
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest("build/js"))
});

gulp.task( "images", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.mozjpeg({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/img"))
})

gulp.task("sprite", function () {
  return gulp.src([
    "source/img/icon-*.svg",
    "source/img/logo-academy.svg"
  ])
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
  });

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});
gulp.task("html", function (){
  return gulp.src("source/*.html")
  .pipe(posthtml())
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({
    minifyJS: true,
    minifyURLs: true,
    collapseWhitespace: true,
    removeComments: true,
    sortAttributes: true,
    sortClassName: true
  }))
  .pipe(gulp.dest("build"));
})
gulp.task("copy", function(){
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
})
gulp.task("clean", function(){
  return del("build");
})

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("compress", "refresh"));
});

gulp.task("refresh", function(done){
  server.reload();
  done();
})

gulp.task("build", gulp.series("clean", "copy", "css", "compress", "sprite", "html"))
gulp.task("start", gulp.series("build", "server"));
