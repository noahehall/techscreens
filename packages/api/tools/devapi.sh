#!/usr/bin/env bash

# todo
# launches @techscreens/api in dev mode
yarn node --require @babel/core \
	--require @babel/register ${NIRV_APP_SRC}/packages/api/dev.js \
	--root-mode root \
	--config-file ${NIRV_APP_ROOT}/babel.config.js \
	--out-file-extension .js;