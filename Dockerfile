# https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

FROM node:13
RUN mkdir /code
WORKDIR /code
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend ./backend
COPY build ./build
WORKDIR /code/backend
EXPOSE 4000
CMD [ "npm", "start" ]
