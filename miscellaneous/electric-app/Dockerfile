FROM electricsql/electric:latest

RUN apt update && apt install -y nodejs npm
RUN npm install --global n yarn
RUN n 22.12.0

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ENTRYPOINT [ "/usr/bin/env" ]
CMD ["yarn", "start"]
