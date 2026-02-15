FROM electricsql/electric:latest

RUN apt update && apt install -y nodejs npm
RUN npm install --global n yarn concurrently
RUN n 22.12.0

WORKDIR /run

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build
RUN yarn install --production --frozen-lockfile

ENTRYPOINT [ "/usr/bin/env" ]
CMD ["sh", "ci/run-container.sh"]
