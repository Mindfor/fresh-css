var gulp = require("gulp");
var $ = require('gulp-load-plugins')();

gulp.task("less", function () {
    gulp.src("fresh.less")
        .pipe($.less())
        .pipe(gulp.dest("./"));

    gulp.src("fresh.less")
        .pipe($.less())
        .pipe($.minify())
        .pipe($.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./"));
});
gulp.task("compile-htmls", function () {
   return gulp.src('./src/*.html')
        .pipe($.htmlTagInclude())
        .pipe(gulp.dest('./dist')) 
});
gulp.task("copy-index", function () {
  return gulp.src('./dist/index.html')
        .pipe(gulp.dest('./'));
})
gulp.task("compile", ["compile-htmls"], function () {
    gulp.start("copy-index");
});

gulp.task("watch", function () {
    gulp.watch(["fresh.less", "src/*"], [ "compile"]);
});

gulp.task("default", function () {
    gulp.start("watch");
});