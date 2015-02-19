var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var path = require('path');
var each = require('foreach');

gulp.task("less", function () {
    return gulp.src("src/less/main.less")
        .pipe($.less())
        .pipe(gulp.dest("./"));

    // gulp.src("src/less/main.less")
    //    .pipe($.less())
    //  .pipe($.minify())
    //.pipe($.rename({
    //  suffix: ".min"
    //        }))
    //      .pipe(gulp.dest("./"));
});

var processHtmlsOpts = {
    process: true,
    templateSettings: {
        interpolate: /{{([\s\S]+?)}}/g // mustache
    },
    data: {
        headerTemplate: '',
        contentTemplate: '',
        getstarted: '',
        forms: '',
        grid: '',
        buttons: '',
        helpers: '',
        labels: '',
        navigation: '',
        tables: '',
        typography: '',
        pagination: ''
    }
}

gulp.task("compile-htmls", function () {
    return gulp.src('./src/contents/*.cnt.html')
        .pipe($.foreach(function (stream, file) {
            var contentTemplateName = path.basename(file.path);

            var nameWithoutExtensionAndSuffix = contentTemplateName.slice(0, -9);

            //assign active class to property that represent left menu item 
            each(processHtmlsOpts.data, function (value, key) {
                if (key == nameWithoutExtensionAndSuffix) {
                    processHtmlsOpts.data[key] = 'active';
                } else {
                    processHtmlsOpts.data[key] = '';
                }
            });
            //chose right header depending on whether it start page or others pages
            if (nameWithoutExtensionAndSuffix == 'getstarted') {
                processHtmlsOpts.data.headerTemplate = 'header.html';
            } else {
                processHtmlsOpts.data.headerTemplate = 'littleheader.html';
            }
            processHtmlsOpts.data.contentTemplate = contentTemplateName;
            return gulp.src('./src/layout.html')
                .pipe($.processhtml(processHtmlsOpts))
                .pipe($.rename(nameWithoutExtensionAndSuffix + '.html'))
                .pipe($.processhtml({
                    includeBase: './src/'
                }))
                .pipe($.processhtml({
                    includeBase: './src/contents/'
                }))
                .pipe(gulp.dest('./'));

        }))
})

gulp.task("create-index", function () {
    return gulp.src('./getstarted.html')
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('./'));
})
gulp.task("compile", ["compile-htmls"], function () {
    gulp.start("create-index");
});

gulp.task("watch", function () {
    gulp.watch(["src/**/*"], ["less", "compile"]);
});

gulp.task("default", function () {
    gulp.start("watch");
});