FROM node:lts-alpine

RUN apk add --no-cache \
    curl \
    bind-tools \
    iputils \
    net-tools

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
