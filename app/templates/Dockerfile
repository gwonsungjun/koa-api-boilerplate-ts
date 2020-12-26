FROM node:erbium-alpine

ENV HOME=/home/node
ENV APP_DIR=$HOME/api

COPY ./ $APP_DIR/

WORKDIR $APP_DIR

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    tzdata \
    && npm i \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apk del build-dependencies \
    && apk add --no-cache git

EXPOSE 9000
CMD ["sh", "-c", "npm run build && npm run prod"]
