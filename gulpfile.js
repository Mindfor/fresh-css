var gulp = require("gulp");
var less = require("gulp-less");

gulp.task("less", function () {
	gulp.src("fresh.less")
		.pipe(less())
		.pipe(gulp.dest("docs"));
});

gulp.task("watch", function() {
	gulp.watch([ "fresh.less", "src/*" ], [ "less" ]);
});

gulp.task("default", [ "less" ], function () {
    gulp.start("watch");
});