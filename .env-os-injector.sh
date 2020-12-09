#!/usr/bin/env bash

# loads the .env file in the current dir
# skips any line beginning with #
# execute this script with . .env-os-injector.sh
# set -x
set -o allexport
. './.env'
set +o allexport