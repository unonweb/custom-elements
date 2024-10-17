#!/bin/bash

function bundleJS() {
	npx -g esbuild --format=esm --bundle --outfile="./bundle.js" --platform=browser ./imports.js
}

function bundleCSS() {
	npx -g esbuild --format=esm --bundle --outfile="./bundle.css" --platform=browser ./imports.css
}

bundleJS