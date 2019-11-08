# Dockerfile
FROM node:8.16.2-alpine
WORKDIR '/app/'

COPY src/ /app/src
COPY *.json /app/
COPY lint.js /app/

# Creating empty config file so the volume gets set up correctly
RUN touch /app/config.js

RUN npm install
RUN npm run build