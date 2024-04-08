module.exports = function (grunt) {
    grunt.registerTask('build-web-app', [
        'clean',
        'eslint',
        'copy:html',
        'copy:icons',
        'copy:manifest',
        'webpack:app',
        'inline',
        'htmlmin',
        'csp-hashes',
        'copy:content-dist',
        'string-replace:service-worker',
        'string-replace:update-manifest',
        'copy:dist-icons',
        'copy:dist-manifest',
        'copy:dist-servicemanager'
    ]);

    grunt.registerTask('build-test', ['webpack:test']);
};
