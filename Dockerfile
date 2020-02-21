# https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

FROM node:13
RUN mkdir /code
WORKDIR /code
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]
