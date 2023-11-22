FROM node:alpine

WORKDIR /mnt
COPY package.json pnpm-lock.yaml script/install-cli.cjs ./
RUN corepack enable pnpm \
    && pnpm i --force --frozen-lockfile \
    && pnpm store prune

RUN sed -i "s;basedir=.*;basedir=$PWD/node_modules/.bin;" node_modules/.bin/eslint \
    && ln -s $PWD/node_modules/.bin/eslint /usr/local/bin/ \
    && node install-cli.cjs

COPY . .
ENV ESLINT_USE_FLAT_CONFIG=true \
    NODE_OPTIONS=--experimental-import-meta-resolve
RUN eslint -v \
    && nextlab-eslint -v \
    && pnpm test \
    && cp -rv script test package.json tsconfig.json /tmp/ \
    && ln -s $PWD/node_modules /tmp/ \
    && cd /tmp \
    && pnpm test.docker

LABEL org.opencontainers.image.source = "https://github.com/nextlab-ai/public-releases"
CMD ["nextlab-eslint"]
