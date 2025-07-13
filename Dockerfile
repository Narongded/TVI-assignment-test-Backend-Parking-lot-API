FROM node:22-alpine AS development

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json yarn.lock* ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

