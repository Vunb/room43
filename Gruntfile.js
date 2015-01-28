module.exports = function (grunt) {

    // Load the Grunt plugins.
    require('matchdep')
        .filterDev('grunt-*')
        .forEach(grunt.loadNpmTasks);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'), cssmin: {
            sitecss: {
                options: {
                    banner: '/*! '
                        + '<%= pkg.name %> - v<%= pkg.version %>'
                        + ' */'
                }, files: {
                    'client/public/css/site.min.css': [
                        //'client/stylesheets/fonts.css',
                        'client/stylesheets/normalize.css',
                        'client/stylesheets/reset.css',
                        'client/stylesheets/main.css',
                        'client/stylesheets/style.css',
                        'client/stylesheets/home/index.css',
                        'client/stylesheets/home/media.css',
                        'client/stylesheets/room/index.css',
                        'client/stylesheets/room/media.css',
                        'client/stylesheets/room/display.css',
                        'client/stylesheets/room/input.css'
                    ]
                }
            }
        }, uglify: {
            options: {
                report: 'min',
                compress: true,
                mangle: true,
                banner: '/*! '
                    + '<%= pkg.name %> - v<%= pkg.version %>'
                    //+ ' - <%= grunt.template.today("yyyy-mm-dd") %>'
                    + ' */'
            },
            'ngMin': {
                files: {
                    'client/public/js/site.min.js': [
                        'client/scripts/app/one.js'
                    ]
                }
            }
        }, ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app1: {
                files: {
                    'client/scripts/app/one.js': [
                        'client/scripts/app/app.js',
                        'client/scripts/app/services/webrtc.js',
                        'client/scripts/app/services/guid.js',
                        'client/scripts/app/services/fluidGrid.js',
                        'client/scripts/app/services/soundEffectManager.js',
                        'client/scripts/app/services/sounds.js',
                        'client/scripts/app/controllers/Home.js',
                        'client/scripts/app/controllers/Room.js',
                        'client/scripts/app/controllers/Info.js',
                        'client/scripts/app/directives/Mouse.js',
                        'client/scripts/app/directives/Screen.js',
                        'client/scripts/app/directives/screenshare.js',
                        'client/vendor/eyes.js'
                    ]
                }
            }
        }, copy: {
            main: {
                src: 'client/scripts/app/one.js',
                dest: 'client/public/js/site.min.js'
            },
            vendor: {
                files: [
                    {
                        expand: true,
                        dest: 'client/public/vendor',
                        cwd: 'client/vendor',
                        src: [
                            '**/*.js',
                            '**/*.css'
                        ]
                    }
                ]
            },
            webrtc: {
                src: 'client/vendor/simplewebrtc/latest.js',
                dest: 'client/public/js/rtc.min.js'
            }
        }
    });

    // Register the default tasks.
    grunt.registerTask('dev', ['ngAnnotate', 'cssmin', 'copy']);
    grunt.registerTask('default', ['ngAnnotate', 'uglify', 'cssmin', 'copy:webrtc']);
};