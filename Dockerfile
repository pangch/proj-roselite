FROM node:16.6-bullseye-slim
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY ./package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

EXPOSE 3001
CMD [ "npm", "start" ]

