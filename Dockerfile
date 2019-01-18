FROM centos:7

USER root
ENV NODE_VERSION v10.15.0

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

RUN source ~/.nvm/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION

ENV NVM_DIR /root/.nvm
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

COPY ./package.json /home/tradingdata/

WORKDIR /home/tradingdata

RUN npm i \
    && npm i pm2 -g

COPY . /home/tradingdata/

CMD ["pm2-docker", "start", "./bin/bitmex.js"]