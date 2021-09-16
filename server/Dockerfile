FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY package*.json ./

RUN npm i

RUN npm audit fix --force

COPY . ./

EXPOSE 9000

CMD ["npm", "run", "start"]