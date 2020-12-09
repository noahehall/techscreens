#!/usr/bin/env bash

# launches the workspace in dev mode
nodemon --delay 5000 \
	--exitcrash  \
	--config ${NIRV_APP_ROOT}/nodemon.json \
	-e ,js \
	--exec yarn node \
	-- \
	--require @babel/core \
	--require @babel/register ${NIRV_APP_ROOT}/dev.js \
	--root-mode root \
	--config-file ${NIRV_APP_ROOT}/babel.config.js \
	--out-file-extension .js;