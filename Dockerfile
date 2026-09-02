#Fase de construccion
FROM node:24 AS build_stage

WORKDIR /usr/app/

COPY --chown=node:node package.json package-lock.json ./
RUN npm install

COPY --chown=node:node ./src .
COPY --chown=node:node ./types .
COPY --chown=node:node ./tsconfig.json .

RUN npm run build

# Fase de produccion
FROM node:24-alpine AS production_stage

USER node
WORKDIR /usr/app/

COPY --chown=node:node package.json  .
COPY --chown=node:node package-lock.json  .
COPY --from=build_stage --chown=node:node /usr/app/dist /usr/app/dist

RUN npm ci --omit=dev

ENV TCP_PORT=8080
EXPOSE 8080

CMD node /usr/app/dist/index