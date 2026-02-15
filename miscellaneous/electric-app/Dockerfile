FROM electricsql/electric:latest

RUN apt update && apt install -y nodejs npm
RUN npm install --global yarn

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
