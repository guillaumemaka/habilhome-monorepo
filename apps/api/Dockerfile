####
# Habilhome vt-rest-api
####

FROM node:14.15.1-stretch-slim as base

RUN apt-get update -y && apt-get install -y \
  build-essential \
  python \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development \
  EXCLUDE_CDK=1

WORKDIR /app

# Copy project specification and dependencies lock files
COPY . .

RUN yarn projen

####
# build
####

FROM node:14.15.1-stretch-slim as build

ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .

RUN yarn build


####
# prod
####

FROM node:14.15.1-stretch-slim as prod

LABEL maintainer "Guillaume Maka <guillaume.maka@gmail.com>"

ENV PATH="/app/node_modules/.bin:/usr/local/bin:$PATH" \
  NODE_ENV=production \
  HOST=0.0.0.0 \
  PORT=3000

WORKDIR /app

COPY docker-entrypoint.sh /usr/local/bin
COPY --from=build /app ./

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]

# Run
CMD [ "node", "-r", "dotenv/config", "dist/bin/www.js"]

####
# dev
####
FROM node:14.15.1-stretch-slim as dev

ENV PATH="/app/node_modules/.bin:$PATH" \
  NODE_ENV=development \
  PORT=3000

WORKDIR /app

COPY --from=base /app .

ENTRYPOINT ["./docker-entrypoint.sh"]

EXPOSE 3000

# Run
CMD ["yarn", "dev"]
