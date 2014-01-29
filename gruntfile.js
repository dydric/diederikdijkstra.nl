module.exports = function(grunt) {
 
    grunt.initConfig({
 
        jekyll: {
            build : {
                dest: '_site'
            }
        },
 
        compass: {
            dist: {
                options: {
                    sassDir: "sass",
                    cssDir: "css",
                    imagesDir: "img",
                    javascriptsDir: "js",
                    fontsDir: "fonts",
                    outputStyle: "compressed",
                    relativeAssets: true
                }
            }
        },
 
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: "img/"
                }]
            }
        },
 
        watch: {
            sass: {
                files: 'sass/**/*.scss',
                tasks: ['compass']
            },
            jekyll: {
                files: ['_layouts/*.html', '_includes/*.md', 'css/style.css', 'css/custom/*.css', '_posts/*.md'],
                tasks: ['jekyll']
            }
        },
 
        browser_sync: {
            files: {
                src : ['_site/css/*.css', '_site/css/custom/*.css', '_posts/*.md']
            },
            options: {
                watchTask: true,
                ghostMode: {
                    clicks: true,
                    scroll: true,
                    links: true,
                    forms: true
                },
                server: {
                    baseDir: '_site'
                }
            }
        }
 
    });
 
    // Load the plugins
    require('load-grunt-tasks')(grunt);

    // Custom tasks
    grunt.registerTask('build', ['compass', 'jekyll']);
    grunt.registerTask('default', ['build', 'browser_sync', 'watch']);
};