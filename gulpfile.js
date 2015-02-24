var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var del = require("del");
var path = require("path");
var each = require("foreach");
var mainBowerFiles = require("main-bower-files");

var paths = {
	src: "src/",
	css: "./",
	vendor: "./vendor/",
	fonts: "./fonts/"
};

gulp.task("bower:clean", function () {
	return del(paths.vendor);
});

gulp.task("bower:install", $.bower);

gulp.task("bower", ["bower:clean", "bower:install"], function () {
	return gulp.src(mainBowerFiles(), {
			base: "bower_components"
		})
		.pipe(gulp.dest(paths.vendor));
});
gulp.task("fonts", function () {
	return gulp
		.src(paths.vendor + "/font-awesome/fonts/*")
		.pipe(gulp.dest(paths.fonts));
});
gulp.task("less", function () {
	return gulp.src(paths.src + "less/main.less")
		.pipe($.less())
		.pipe(gulp.dest(paths.css));

	// gulp.src("src/less/main.less")
	//	.pipe($.less())
	//  .pipe($.minify())
	//.pipe($.rename({
	//  suffix: ".min"
	//		}))
	//	  .pipe(gulp.dest("./"));
});

var processHtmlsOpts = {
	process: true,
	templateSettings: {
		interpolate: /{{([\s\S]+?)}}/g // mustache
	},
	data: {
		headerTemplate: "",
		contentTemplate: "",
		getstarted: "",
		forms: "",
		grid: "",
		buttons: "",
		helpers: "",
		labels: "",
		navigation: "",
		tables: "",
		typography: "",
		blocks: ""
	}
}

gulp.task("compile-htmls", function () {
	return gulp.src(paths.src + "contents/*.cnt.html")
		.pipe($.foreach(function (stream, file) {
			var contentTemplateName = path.basename(file.path);

			var nameWithoutExtensionAndSuffix = contentTemplateName.slice(0, -9);

			//assign active class to property that represent left menu item 
			each(processHtmlsOpts.data, function (value, key) {
				if (key == nameWithoutExtensionAndSuffix) {
					processHtmlsOpts.data[key] = "active";
				} else {
					processHtmlsOpts.data[key] = "";
				}
			});
			//chose right header depending on whether it start page or others pages
			if (nameWithoutExtensionAndSuffix == "getstarted") {
				processHtmlsOpts.data.headerTemplate = "header.html";
			} else {
				processHtmlsOpts.data.headerTemplate = "littleheader.html";
			}
			processHtmlsOpts.data.contentTemplate = contentTemplateName;
			return gulp.src(paths.src + "layout.html")
				.pipe($.processhtml(processHtmlsOpts))
				.pipe($.rename(nameWithoutExtensionAndSuffix + ".html"))
				.pipe($.processhtml({
					includeBase: paths.src
				}))
				.pipe($.processhtml({
					includeBase: paths.src + "contents/"
				}))
				.pipe(gulp.dest("./"));

		}))
})

gulp.task("create-index", function () {
	return gulp.src("./getstarted.html")
		.pipe($.rename("index.html"))
		.pipe(gulp.dest("./"));
})
gulp.task("compile", ["compile-htmls"], function () {
	gulp.start("create-index");
});

gulp.task("watch", function () {
	gulp.watch(["src/**"], ["less", "compile"]);
});

gulp.task("default", ["bower"], function () {
	gulp.start(["watch", "fonts"]);
});