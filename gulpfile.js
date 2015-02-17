var gulp = require("gulp");
var less = require("gulp-less");
var minify = require('gulp-minify-css');

gulp.task("less", function () {
	gulp.src("fresh.less")
		.pipe(less())
		.pipe(minify())
		.pipe(gulp.dest("./"));
});

gulp.task("watch", function() {
	gulp.watch([ "fresh.less", "src/*" ], [ "less" ]);
});

gulp.task("default", [ "less" ], function () {
    gulp.start("watch");
});