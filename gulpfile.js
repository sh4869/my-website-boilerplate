const fs = require("fs");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const data = require("gulp-data");
const sass = require("gulp-sass");
const runSequence = require("run-sequence");
const moduleImporter = require("sass-module-importer");


gulp.task('pug', () => {
    gulp.src(["www/pug/**/*.pug","!www/pug/include/*.pug"], { base: "www/pug/" })
        .pipe(plumber({
            errorHandler: (err) => {
                console.log(err);
            }
        }))
        .pipe(data(
            (file) => {
                const dirname = __dirname + "/www/datas/";
                const files = fs.readdirSync(dirname);
                let datas = {};
                files.forEach((name) => {
                    datas[name.replace(".json", "")] = JSON.parse(fs.readFileSync(dirname + name));
                });
                return { data: datas };
            })
        )
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest("dest/"));
})

gulp.task("img", () => {
    return gulp.src(["www/img/**/*.png", "www/img/**/*.jpg"], { base: "www/img/" })
        .pipe(gulp.dest("dest/img/"));
});

gulp.task("css", () => {
    return gulp.src("www/scss/index.scss", { "base": "www/scss" })
        .pipe(plumber({
            errorHandler: (err) => {
                console.log(err);
            }
        }))
        .pipe(sass({ outputStyle: 'expanded', importer: moduleImporter() }).on('error', sass.logError))
        .pipe(gulp.dest("dest/css/"));
});

gulp.task("font",() => {
    return gulp.src("node_modules/font-awesome/fonts/*")
        .pipe(gulp.dest("dest/fonts/"));
});

gulp.task("favicon",() => {
    return gulp.src("www/favicon/*")
        .pipe(gulp.dest("dest/favicon/"));
})

gulp.task("cname",() => {
    return gulp.src("www/CNAME")
        .pipe(gulp.dest("dest/"));
})

gulp.task("build", ["img", "pug", "css","font","cname","favicon"], () => {

});

gulp.task('watch', () => {
    gulp.watch(["www/pug/**/*.pug","www/datas/**/*.json"], ["pug"]);
    gulp.watch(["www/scss/**/*.scss"], ["css"]);
    gulp.watch(["www/img/**/*.png", "www/img/**/*.jpg"], ["img"])
})

gulp.task('default', ["watch"]);
