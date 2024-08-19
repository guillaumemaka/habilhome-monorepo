#!/bin/bash -e

TARGET="${TARGET-prod}"
COMMIT=$(git rev-parse --short HEAD)
TAG="$TARGET-$COMMIT"
IMAGE_TAG="650988679566.dkr.ecr.ca-central-1.amazonaws.com/habilhome/vt-rest-api:$TAG"

DOCKER_BUILDKIT=1 docker build \
--target "$TARGET" \
--tag 650988679566.dkr.ecr.ca-central-1.amazonaws.com/habilhome/vt-rest-api:"$TAG" \
--tag 650988679566.dkr.ecr.ca-central-1.amazonaws.com/habilhome/vt-rest-api:latest \
--tag habilhome-api:latest-"$TARGET" \
--tag habilhome-api:latest \
--tag habilhome-api:"$TAG" .

if [ $? -eq 1 ]; then
  echo "Docker build failed; exiting;"
  exit 1
else
  echo "Built image $IMAGE_TAG"
fi

if [ "$PUSH" = 1 ]; then

# if [ $? -eq 1 ]; then
#   echo "Docker Login failed; exiting;"
#   exit 1
# fi

AWS_PROFILE=ProjetOntario docker push --all-tags 650988679566.dkr.ecr.ca-central-1.amazonaws.com/habilhome/vt-rest-api

if [ $? -eq 1 ]; then
  echo "Docker push failed; exiting;"
  exit 1
else
  echo "Pushed $IMAGE_TAG"
fi
fi

echo "Done!"

exit 0

