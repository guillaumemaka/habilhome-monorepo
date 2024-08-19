#!/bin/bash

TARGET=${1:-"prod"}
BUILD_ARGS=""

if [ "$TARGET" = "prod" ]
then
  BUILD_ARGS="--build-arg API_URL_BROWSER=\"https://api.habilhome.com/api\" --build-arg API_URL=\"http://api:4000\""
fi;

DOCKER_BUILDKIT=1 docker build $BUILD_ARGS --tag habilhome-admin:latest-$TARGET --target $TARGET .
