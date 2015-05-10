var gulp = require("gulp");
var plumbler = require("gulp-plumber");
var less = require("gulp-less");
var minify = require("gulp-minify-css");
var rename = require("gulp-rename");

gulp.task("less", function () {
	gulp.src("fresh.less")
		.pipe(plumbler())
		.pipe(less())
		.pipe(gulp.dest("./"));
	
	gulp.src("fresh.less")
		.pipe(plumbler())
		.pipe(less())
		.pipe(minify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest("./"));
});

gulp.task("default", ["less"]);

gulp.task("watch", ["default"], function() {
	gulp.watch([ "fresh.less", "src/*" ], [ "less" ]);
});