FROM node:22.20.0-alpine3.21 AS base
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

FROM base AS builder
RUN npm run build

FROM nginx:alpine AS server
COPY --from=builder /app/dist /usr/share/nginx/html