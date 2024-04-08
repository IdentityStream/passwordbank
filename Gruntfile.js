/* eslint-env node */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const Agent = require('agentkeepalive-ntlm');
require('dotenv').config();

const webpackConfig = require('./build/webpack.config');
const webpackConfigTest = require('./test/test.webpack.config');
const pkg = require('./package.json');
const servicemanagerDir = process.env.SERVICEMANAGERDIR;
const servicemanagerHost = process.env.SERVICEMANAGERHOST;

module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.loadTasks('build/tasks');

    require('./grunt.tasks')(grunt);
    require('./grunt.entrypoints')(grunt);

    const date = new Date();
    grunt.config.set('date', date);

    const dt = date.toISOString().replace(/T.*/, '');

    const keepaliveAgent = new Agent({
        maxSockets: 100,
        maxFreeSockets: 10,
        keepAliveMsecs: 10000,
        timeout: 60000,
        freeSocketKeepAliveTimeout: 30000, // free socket keepalive for 3000 seconds
        cookieName: 'ASP.NET_SessionId'
    });

    let sha = grunt.option('commit-sha');
    if (!sha) {
        try {
            sha = execSync('git rev-parse --short HEAD').toString('utf8').trim();
        } catch (e) {
            grunt.warn(
                "Cannot get commit sha from git. It's recommended to build KeeWeb from a git repo " +
                    'because commit sha is displayed in the UI, however if you would like to build from a folder, ' +
                    'you can override what will be displayed in the UI with --commit-sha=xxx.'
            );
        }
    }
    grunt.log.writeln(`Building KeeWeb v${pkg.version} (${sha})`);

    const webpackOptions = {
        date,
        beta: !!grunt.option('beta'),
        sha,
        appleTeamId: '3LE7JZ657W'
    };

    grunt.initConfig({
        noop: { noop: {} },
        clean: {
            dist: ['dist', 'tmp'],
            desktop: ['tmp/desktop', 'dist/desktop']
        },
        copy: {
            html: {
                src: 'app/index.html',
                dest: 'tmp/index.html',
                nonull: true
            },
            'content-dist': {
                cwd: 'app/content/',
                src: '**',
                dest: 'dist/',
                expand: true,
                nonull: true
            },
            icons: {
                cwd: 'app/icons/',
                src: ['*.png', '*.svg'],
                dest: 'tmp/icons/',
                expand: true,
                nonull: true
            },
            'dist-icons': {
                cwd: 'app/icons/',
                src: ['*.png', '*.svg'],
                dest: 'dist/icons/',
                expand: true,
                nonull: true
            },
            manifest: {
                cwd: 'app/manifest/',
                src: ['*.json', '*.xml'],
                dest: 'tmp/',
                expand: true,
                nonull: true
            },
            'dist-manifest': {
                cwd: 'app/manifest/',
                src: ['*.json', '*.xml'],
                dest: 'dist/',
                expand: true,
                nonull: true
            },
            'dist-servicemanager': {
                cwd: 'dist/',
                src: ['**'],
                dest: servicemanagerDir,
                expand: true
            },
            'desktop-html': {
                src: 'dist/index.html',
                dest: 'tmp/desktop/app/index.html',
                nonull: true
            },
            'desktop-app-content': {
                cwd: 'desktop/',
                src: ['**', '!package-lock.json'],
                dest: 'tmp/desktop/app/',
                expand: true,
                nonull: true
            },
            'desktop-darwin-installer-helper-x64': {
                cwd: 'tmp/desktop/KeeWeb Installer.app',
                src: '**',
                dest: 'tmp/desktop/KeeWeb-darwin-x64/KeeWeb.app/Contents/Installer/KeeWeb Installer.app',
                expand: true,
                nonull: true,
                options: { mode: true }
            },
            'desktop-darwin-installer-helper-arm64': {
                cwd: 'tmp/desktop/KeeWeb Installer.app',
                src: '**',
                dest: 'tmp/desktop/KeeWeb-darwin-arm64/KeeWeb.app/Contents/Installer/KeeWeb Installer.app',
                expand: true,
                nonull: true,
                options: { mode: true }
            },
            'desktop-win32-dist-x64': {
                src: 'tmp/desktop/KeeWeb.win.x64.exe',
                dest: `dist/desktop/KeeWeb-${pkg.version}.win.x64.exe`,
                nonull: true
            },
            'desktop-win32-dist-ia32': {
                src: 'tmp/desktop/KeeWeb.win.ia32.exe',
                dest: `dist/desktop/KeeWeb-${pkg.version}.win.ia32.exe`,
                nonull: true
            },
            'desktop-win32-dist-arm64': {
                src: 'tmp/desktop/KeeWeb.win.arm64.exe',
                dest: `dist/desktop/KeeWeb-${pkg.version}.win.arm64.exe`,
                nonull: true
            },
            'native-modules-darwin-x64': {
                src: 'node_modules/@keeweb/keeweb-native-modules/*-darwin-x64.node',
                dest: 'tmp/desktop/KeeWeb-darwin-x64/KeeWeb.app/Contents/Resources/',
                nonull: true
            },
            'native-modules-darwin-arm64': {
                src: 'node_modules/@keeweb/keeweb-native-modules/*-darwin-arm64.node',
                dest: 'tmp/desktop/KeeWeb-darwin-arm64/KeeWeb.app/Contents/Resources/',
                nonull: true
            },
            'native-modules-win32-x64': {
                src: 'node_modules/@keeweb/keeweb-native-modules/*-win32-x64.node',
                dest: 'tmp/desktop/KeeWeb-win32-x64/resources/',
                nonull: true
            },
            'native-modules-win32-ia32': {
                src: 'node_modules/@keeweb/keeweb-native-modules/*-win32-ia32.node',
                dest: 'tmp/desktop/KeeWeb-win32-ia32/resources/',
                nonull: true
            },
            'native-modules-win32-arm64': {
                src: 'node_modules/@keeweb/keeweb-native-modules/*-win32-arm64.node',
                dest: 'tmp/desktop/KeeWeb-win32-arm64/resources/',
                nonull: true
            },
            'native-modules-linux-x64': {
                src: 'node_modules/@keeweb/keeweb-native-modules/*-linux-x64.node',
                dest: 'tmp/desktop/keeweb-linux-x64/resources/',
                nonull: true
            },
            'darwin-installer-icon': {
                src: 'graphics/icon.icns',
                dest: 'tmp/desktop/KeeWeb Installer.app/Contents/Resources/applet.icns',
                nonull: true
            },
            'native-messaging-host-darwin-x64': {
                src: 'node_modules/@keeweb/keeweb-native-messaging-host/darwin-x64/keeweb-native-messaging-host',
                dest: 'tmp/desktop/KeeWeb-darwin-x64/KeeWeb.app/Contents/MacOS/util/keeweb-native-messaging-host',
                nonull: true,
                options: { mode: '0755' }
            },
            'native-messaging-host-darwin-arm64': {
                src: 'node_modules/@keeweb/keeweb-native-messaging-host/darwin-arm64/keeweb-native-messaging-host',
                dest: 'tmp/desktop/KeeWeb-darwin-arm64/KeeWeb.app/Contents/MacOS/util/keeweb-native-messaging-host',
                nonull: true,
                options: { mode: '0755' }
            },
            'native-messaging-host-linux-x64': {
                src: 'node_modules/@keeweb/keeweb-native-messaging-host/linux-x64/keeweb-native-messaging-host',
                dest: 'tmp/desktop/keeweb-linux-x64/keeweb-native-messaging-host',
                nonull: true,
                options: { mode: '0755' }
            },
            'native-messaging-host-win32-x64': {
                src: 'node_modules/@keeweb/keeweb-native-messaging-host/win32-x64/keeweb-native-messaging-host.exe',
                dest: 'tmp/desktop/KeeWeb-win32-x64/keeweb-native-messaging-host.exe',
                nonull: true
            },
            'native-messaging-host-win32-ia32': {
                src: 'node_modules/@keeweb/keeweb-native-messaging-host/win32-ia32/keeweb-native-messaging-host.exe',
                dest: 'tmp/desktop/KeeWeb-win32-ia32/keeweb-native-messaging-host.exe',
                nonull: true
            },
            'native-messaging-host-win32-arm64': {
                src: 'node_modules/@keeweb/keeweb-native-messaging-host/win32-arm64/keeweb-native-messaging-host.exe',
                dest: 'tmp/desktop/KeeWeb-win32-arm64/keeweb-native-messaging-host.exe',
                nonull: true
            }
        },
        eslint: {
            app: ['app/scripts/**/*.js'],
            desktop: ['desktop/**/*.js', '!desktop/node_modules/**'],
            build: ['Gruntfile.js', 'grunt.*.js', 'build/**/*.js', 'webpack.config.js'],
            plugins: ['plugins/**/*.js'],
            util: ['util/**/*.js'],
            installer: ['package/osx/installer.js']
        },
        inline: {
            app: {
                src: 'tmp/index.html',
                dest: 'tmp/app.html'
            }
        },
        'csp-hashes': {
            options: {
                algo: 'sha512',
                expected: {
                    style: 1,
                    script: 1
                }
            },
            app: {
                src: 'tmp/app.html',
                dest: 'dist/index.html'
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            app: {
                files: {
                    'tmp/app.html': 'tmp/app.html'
                }
            }
        },
        'string-replace': {
            'update-manifest': {
                options: {
                    replacements: [
                        {
                            pattern: /"version":\s*".*?"/,
                            replacement: `"version": "${pkg.version}"`
                        },
                        {
                            pattern: /"date":\s*".*?"/,
                            replacement: `"date": "${dt}"`
                        }
                    ]
                },
                files: { 'dist/update.json': 'app/update.json' }
            },
            'service-worker': {
                options: { replacements: [{ pattern: '0.0.0', replacement: pkg.version }] },
                files: { 'dist/service-worker.js': 'app/service-worker.js' }
            },
            'desktop-public-key': {
                options: {
                    replacements: [
                        {
                            pattern: "'@@PUBLIC_KEY_CONTENT'",
                            replacement:
                                '`' +
                                fs
                                    .readFileSync('app/resources/public-key.pem', {
                                        encoding: 'utf8'
                                    })
                                    .trim() +
                                '`'
                        }
                    ]
                },
                files: { 'tmp/desktop/app/main.js': 'desktop/main.js' }
            }
        },
        webpack: {
            app: webpackConfig.config(webpackOptions),
            test: webpackConfigTest
        },
        'webpack-dev-server': {
            options: {
                webpack: webpackConfig.config({
                    ...webpackOptions,
                    mode: 'development',
                    sha: 'dev',
                    servicemanagerHost
                }),
                publicPath: '/',
                contentBase: [
                    path.resolve(__dirname, 'tmp'),
                    path.resolve(__dirname, 'app/content')
                ],
                progress: false,
                proxy: [
                    {
                        context: ['/api'],
                        target: servicemanagerHost,
                        secure: false,
                        changeOrigin: true,
                        onProxyRes: (proxyRes) => {
                            const key = 'www-authenticate';
                            proxyRes.headers[key] =
                                proxyRes.headers[key] && proxyRes.headers[key].split(',');
                        },
                        agent: keepaliveAgent,
                        proxyTimeout: 5000
                    }
                ]
            },
            js: {
                keepalive: true,
                port: 8085
            }
        },
        'run-test': {
            options: {
                headless: true
            },
            default: 'test/runner.html'
        }
    });
};
