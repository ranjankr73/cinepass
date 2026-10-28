# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS runtime-base

RUN apt-get update \
&& apt-get install -y --no-install-recommends openssl ca-certificates \
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM runtime-base AS base

COPY package.json package-lock.json ./


# Development image: full dependencies and source code.
FROM base AS development

ENV NODE_ENV=development

RUN chown node:node /app

USER node

RUN npm ci

COPY --chown=node:node . .

RUN DATABASE_URL="postgresql://username:password@localhost:5432/mydb" \
npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]


# Build the application and generated Prisma client.
FROM base AS build

RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://username:password@localhost:5432/mydb" \
npm run build


# Install production dependencies only.
FROM base AS production-deps

ENV NODE_ENV=production

RUN npm ci --omit=dev \
&& npm cache clean --force


# Minimal production runtime.
FROM runtime-base AS production

ENV NODE_ENV=production

COPY --from=production-deps --chown=node:node \
/app/node_modules ./node_modules

COPY --from=build --chown=node:node \
/app/dist ./dist

COPY --chown=node:node package.json ./package.json

USER node

EXPOSE 3000

CMD ["node", "dist/src/server.js"]
