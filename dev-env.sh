#!/usr/bin/env bash

SCHEMA=${SCHEMA:-http}

KEEWEB_GH=git@github.com:keeweb

if [[ "$SCHEMA" == 'http' ]]; then
    KEEWEB_GH=https://github.com/keeweb
fi

echo "Cloning KeeWeb ($KEEWEB_GH) into $PWD..."

git clone $KEEWEB_GH/favicon-proxy.git favicon-proxy
git clone $KEEWEB_GH/kdbxweb.git kdbxweb
git clone $KEEWEB_GH/beta.keeweb.info.git keeweb-beta
git clone $KEEWEB_GH/keeweb-site.git keeweb-site
git clone $KEEWEB_GH/keeweb-plugins.git keeweb-plugins
git clone $KEEWEB_GH/keeweb-connect.git keeweb-connect

mkdir keys

echo "Done! KeeWeb is cloned into $PWD"
