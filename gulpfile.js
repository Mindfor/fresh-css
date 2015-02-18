var gulp = require("gulp");
var less = require("gulp-less");
var minify = require("gulp-minify-css");
var rename = require("gulp-rename");

gulp.task("less", function () {
	gulp.src("fresh.less")
		.pipe(less())
		.pipe(gulp.dest("./"));
	
	gulp.src("fresh.less")
		.pipe(less())
		.pipe(minify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest("./"));
});

gulp.task("watch", function() {
	gulp.watch([ "fresh.less", "src/*" ], [ "less" ]);
});

gulp.task("default", [ "less" ], function () {
    gulp.start("watch");
});