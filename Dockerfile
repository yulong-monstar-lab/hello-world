# lts-gallium refers to v16
# Using this instead of node:16 to avoid dependabot updates
FROM node:lts-gallium as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

RUN npm run build

RUN npm prune

FROM node:lts-gallium

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env ./
COPY --from=builder /usr/src/app/tsconfig.json ./
COPY --from=builder /usr/src/app/tsconfig.build.json ./

EXPOSE 3000

USER node
CMD [ "npm", "run", "start:prod" ]
