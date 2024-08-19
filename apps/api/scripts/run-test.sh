#!/bin/bash

# if [[ -n "$(docker ps -aq -f name=^/ci_app_1$ 2> /dev/null)"  ]]; then
#     echo "Clearing logs...\n"

#     log=$(docker inspect -f '{{.LogPath}}' ci_app_1 2> /dev/null)
#     truncate -s 0 $log
# fi

export COMPOSE_DOCKER_CLI_BUILD=1

if docker info; then
  echo "Docker is running!"
else
  echo "Docker is not running!"
  exit 1
fi

export DOCKER_BUILDKIT=1

echo "Executing integration tests..."

if [[ $BUILD -eq "1" ]]
then
  echo "Rebuilding asked!"
  DOCKER_BUILDKIT=1 docker-compose build app
fi

docker network create localstack 1>/dev/null 2>/dev/null

echo "Destroying previous containers..."
docker-compose -p ci rm --force --stop app 1> /dev/null 2>/dev/null

echo "Running tests..."
docker-compose -p ci \
  -f docker-compose.yml \
  -f docker-compose.test.yml \
  run \
  --rm \
  app "$@" \
  --exit-code-from=app

unset COMPOSE_DOCKER_CLI_BUILD

if [[ $? -gt 0 ]]
then
  echo "Integration tests failed..."
  exit 1
fi

echo "Integration tests passed"
exit 0
