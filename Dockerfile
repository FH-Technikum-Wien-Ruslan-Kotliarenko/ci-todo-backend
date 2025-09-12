# runtime-only image (no dev deps)
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

# install only prod deps for deterministic builds
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# app sources
COPY ./src ./src
COPY .env ./.env

EXPOSE 8080
CMD ["node", "src/server.js"]
