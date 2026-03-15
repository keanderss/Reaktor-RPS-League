FROM node:22.20.0-alpine3.21 AS base
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

FROM base AS builder
RUN npx prisma generate
RUN npm run build

FROM node:22.20.0-alpine3.21 AS runtime
WORKDIR /app
COPY --from=builder /app/dist .
COPY prisma.config.ts .
COPY package*.json .
COPY prisma prisma
RUN npm ci --omit=dev
CMD ["npm", "run", "prod"]