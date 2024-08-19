#####
# Habilhome habilhome/vt-admin
##

#####
# vendor
##
# Build stage install dependencies
FROM node:14.15.1-stretch-slim as vendor
ENV NODE_ENV development
ENV VENDOR /vendor
ENV EXCLUDE_CDK=1

RUN apt-get update -y && apt-get install -y \
  build-essential \
  python \
  && rm -rf /var/lib/apt/lists/*

WORKDIR ${VENDOR}

COPY .projenrc.js .

RUN npx projen

#####
# Dev
##
# Dev image
FROM node:14.15.1-stretch-slim as dev

ENV APP_ROOT=/app \
  HOST=0.0.0.0 \
  NODE_ENV=development \
  DEBUG=true \
  SEND_HIT_TASK=true \
  CONTAINER_API_URL=http://api:4000/api \
  API_PREFIX=/api \
  API_HOST=api \
  API_PORT=4000


WORKDIR ${APP_ROOT}

COPY --from=vendor /vendor/node_modules ./node_modules
COPY . ${APP_ROOT}
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["yarn", "dev"]

#####
# build
##
FROM node:14.15.1-stretch-slim as build

ARG API_PREFIX=/api
ARG CONTAINER_API_URL=http://api:4000/api

ENV CONTAINER_API_URL=$CONTAINER_API_URL \
  API_PRFIX=$API_PREFIX \
  API_HOST=api \
  API_PORT=4000 \
  APP_ROOT=/app \
  NODE_ENV=production

WORKDIR ${APP_ROOT}

COPY --from=vendor /vendor/node_modules ${APP_ROOT}/node_modules
COPY . ${APP_ROOT}

RUN yarn build

#####
# Prod
##
FROM node:14.15.1-stretch-slim as prod

ARG API_PREFIX=/api
ARG CONTAINER_API_URL=http://api:4000/api

ENV APP_ROOT=/app  \
  CONTAINER_API_URL=$CONTAINER_API_URL \
  SERVER_HOST=0.0.0.0 \
  SERVER_PORT=3000 \
  API_PREFIX=/api \
  API_HOST=api \
  API_PORT=4000 \
  NODE_ENV=production

WORKDIR ${APP_ROOT}

COPY --from=build ${APP_ROOT} ${APP_ROOT}

EXPOSE ${SERVER_PORT}

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["node", "server/index.js"]
