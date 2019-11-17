# Dockerfile
FROM node:8.16.2-alpine
WORKDIR '/app/'

COPY src/ /app/src
COPY *.json /app/

RUN npm install
RUN npm run build