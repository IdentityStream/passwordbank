# Free cross-platform password manager compatible with KeePass

This webapp is a browser and desktop password manager compatible with KeePass databases. It doesn't require any server or additional resources.
The app can run either in browser, or as a desktop app.

![screenshot](img/screenshot.png)

# Status

The app is quite stable now. Basic stuff, as well as more advanced operations, should be rather reliable.

# Self-hosting

Everything you need to host this app on your server is any static file server. The app is a single HTML file + a service worker (optionally; for offline access).

# Building

The app can be built with grunt: `grunt` (html file will be in `dist/`).    
Desktop apps are built with `grunt desktop`. This works only in macOS as it builds dmg; requires wine.  
Also, a hardware token is required.  
To run Electron app without building an installer, build the app with `grunt` and start it this way:
```bash
grunt dev
npm run-script electron
```

For debug build:

1. run `grunt dev`
2. open `http://localhost:8085`

# License

[MIT](https://github.com/IdentityStream-AS/passwordbank/blob/master/LICENSE)
