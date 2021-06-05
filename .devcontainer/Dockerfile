FROM ignisda/developr-workspace

RUN sudo apk add g++ py3-pyzmq; \
    sudo apk add --update --virtual=.build-dependencies alpine-sdk nodejs \
    ca-certificates musl-dev gcc python3-dev make cmake g++ gfortran libpng-dev \
    free type-dev libxml2-dev libxslt-dev --no-cache && apk add --update git tini --no-cache
