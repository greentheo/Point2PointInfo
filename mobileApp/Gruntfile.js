module.exports = function(grunt) {

    var copySrcFiles = [
        // just copy them all!
        '**',

        // ...except the following file types
        '!**/*.js',
        '!**/*.min.css',
        '!**/*.map',

        // ...and these directories
        '!**/js',
        '!**/viewmodels'
    ];

    var copyProcessFile = function (content, srcpath, built) {
        if (srcpath == 'app/index.html') {
            var processedContent = content.replace('"../lib/require/require.js"', '"main.js"');

            if (built) {
                processedContent = processedContent
                    .replace('<!--cordova-->', '<script type="text/javascript" src="cordova.js"></script>')
                    .replace('<!--cordovaplugins-->', '<script type="text/javascript" src="cordova_plugins.js"></script>');
            }

            return processedContent;
        }

        return content;
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        durandaljs: {
            options: {
                extraModules: [
                    'plugins/dialog',
                    'plugins/observable',
                    'transitions/entrance'
                ]
            },
            dev: {
                options: {
                    output: 'dev/main.js',
                    almond: true
                }
            },
            prod: {
                options: {
                    output: 'www/main.js',
                    almond: true,
                    minify: true
                }
            }
        },
        clean: {
            dev: ['dev/'],
            prod: ['www/']
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: copySrcFiles,
                        dest: 'dev/'
                    }
                ],
                options: {
                    process: function (content, srcpath) {
                        return copyProcessFile(content, srcpath);
                    }
                }
            },
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: copySrcFiles,
                        dest: 'www/'
                    }
                ],
                options: {
                    process: function (content, srcpath) {
                        return copyProcessFile(content, srcpath, true);
                    }
                }
            }
        }

    });

    // Load the plugin that provides the "durandaljs" task.
    grunt.loadNpmTasks('grunt-durandaljs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'clean:prod',
        'copy:prod',
        'durandaljs:prod'
    ]);

    grunt.registerTask('dev', [
        'clean:dev',
        'copy:dev',
        'durandaljs:dev'
    ]);

};
