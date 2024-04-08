// prettier-ignore

module.exports = function(grunt) {
    grunt.registerTask('default', 'Default: build web app', [
        'build-web-app'
    ]);

    grunt.registerTask('dev', 'Build project and start web server and watcher', [
        'build-web-app',
        'devsrv'
    ]);

    grunt.registerTask('devsrv', 'Start web server and watcher', [
        'webpack-dev-server'
    ]);
    
    grunt.registerTask('test', 'Build and run tests', [
        'build-test',
        'run-test'
    ]);
};
