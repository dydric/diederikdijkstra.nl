module.exports = function(grunt) {
 
    grunt.initConfig({
 
        jekyll: {
            build : {
                dest: '_site'
            }
        },
 
        // sass: {
        //     dist: {
        //         options: {
        //             outputStyle: 'compressed'
        //         },
        //         files: {
        //             'css/style.css': 'sass/style.scss',
        //             'css/custom.*css': 'sass/custom.*.scss'
        //         }
        //     }
        // },
 
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
 
        watch: {
            sass: {
                files: 'sass/**/*.scss',
                tasks: ['compass']
            },
            jekyll: {
                files: ['_layouts/*.html', '_includes/*.md', 'css/style.css', 'css/custom/*.css'],
                tasks: ['jekyll']
            }
        },
 
        browser_sync: {
            files: {
                src : ['_site/css/*.css']
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