var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var del = require("del");
var path = require("path");
var mainBowerFiles = require("main-bower-files");

var paths = {
	src: "src",
	dist: "",
	lib: "lib",
	fonts: "fonts"
};

gulp.task("bower:clean", function () {
	return del(paths.lib);
});

gulp.task("bower:install", $.bower);

gulp.task("bower", ["bower:clean", "bower:install"], function () {
	return gulp.src(mainBowerFiles(), { base: "bower_components" })
		.pipe(gulp.dest(paths.lib));
});

gulp.task("fonts", function () {
	return gulp.src(paths.lib + "/font-awesome/fonts/*")
		.pipe(gulp.dest(paths.fonts));
});

gulp.task("less", function () {
	return gulp.src(paths.src + "/less/main.less")
		.pipe($.less())
		//.pipe($.minifyCss())
		.pipe(gulp.dest(paths.dist));
});

gulp.task("compile", function () {
	return gulp.src(paths.src + "/content/*.html")
		.pipe($.foreach(function (stream, file) {
			var filename = path.basename(file.path);
			var name = filename.slice(0, -5);
			
			var options = {
				process: true,
				includeBase: paths.src,
				templateSettings: {
					interpolate: /{{([\s\S]+?)}}/g // mustache
				},
				data: {
					header: "header.html",
					content: filename
				}
			}

			// Choose header depending on whether it start page or others pages
			if (name == "index")
				options.data.headerTemplate = "header-index.html";
		
			return gulp.src(paths.src + "/layout.html")
				.pipe($.processhtml(options))
				.pipe($.processhtml({ includeBase: paths.src }))
				.pipe($.rename(filename))
				.pipe(gulp.dest(paths.dist));
		}));
});

gulp.task("watch", ["fonts", "less", "compile"], function () {
	gulp.watch([paths.src + "/**/*.less"], ["less"]);
	gulp.watch([paths.src + "/**/*.html"], ["compile"]);
});

gulp.task("default", ["bower"], function () {
	gulp.start("watch");
});