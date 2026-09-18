FROM ghcr.io/canonical/snapcraft:8_core24

COPY entrypoint.sh /entrypoint.sh

RUN apt-get update
RUN apt-get install --no-install-recommends -y build-essential ca-certificates gnupg git-core unzip curl pkg-config rpm sudo
# RUN curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
RUN apt-get install -y nodejs
RUN npm i -g grunt-cli

ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}

ENTRYPOINT ["/entrypoint.sh"]
