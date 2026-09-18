#!/bin/bash -e

cd /github/workspace
git config --global --add safe.directory /github/workspace
npm ci
grunt --commit-sha=${COMMIT_SHA} desktop-linux
