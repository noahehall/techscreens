# https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/experimental.md
# set directives
# syntax=docker/dockerfile:experimental
# escape=\ (backslash)

# set build args not persisted into the final build image
# but they are visible to consumers of the image
# and changes to ARGS impact caching  for all run instructions
# ENV vars persist to the container
ARG ALPINE_VERSION=15.3.0
ARG BASEDIR=/usr/src
ARG WORKDIR=/usr/src/app
ARG CACHEDIR=/usr/src/cache


# base image
FROM scratch as setupimage
ARG CACHEDIR
WORKDIR ${CACHEDIR}
COPY ./package.json ./*yarn* ./
CMD ["ls"]

# install image
FROM node:${ALPINE_VERSION}-alpine as installimage
ARG CACHEDIR
ARG BASEDIR
RUN apk add --no-cache make gcc g++ python3
COPY --from=setupimage ${CACHEDIR} ${CACHEDIR}
WORKDIR ${CACHEDIR}
# create and set non-root USER: https://gist.github.com/sharkySharks/bd3811c9ff7645880cac9160f19b3158
RUN addgroup -g 1001 appuser && \
    adduser -S -u 1001 -G appuser appuser && \
    chown -R appuser:appuser ${BASEDIR} && \
    chmod 755 ${BASEDIR}
USER  appuser
RUN yarn install
CMD ["ls"]
ONBUILD COPY ${CACHEDIR}/* ${WORKDIR}/*

# dev image
FROM installimage as devimage
ARG WORKDIR
ARG BASEDIR
ARG CACHEDIR
EXPOSE 3001
EXPOSE 3000
ENV NODE_ENV="development"
ENV NODE_OPTIONS="NODE_OPTIONS --trace-uncaught"
WORKDIR ${WORKDIR}
ENV PATH="${WORKDIR}/node_modules/.bin:${PATH}"
USER appuser
COPY . .
RUN mv ${CACHEDIR}/* .
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["ash", "./entrypoint.sh"]
