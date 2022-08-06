# Build develop image to compile JS and resource files
FROM node:16.6-bullseye-slim as develop
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY ./package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

FROM node:16.6-bullseye-slim
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
COPY --from=develop /app/dist /app/dist

EXPOSE 3000
CMD [ "npm", "start" ]

