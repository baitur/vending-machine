# Common build stage
FROM node:14.14.0-alpine3.12 as common-build-stage

COPY . ./app

WORKDIR /app
RUN npm install

EXPOSE 3000

# Dvelopment build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development
#RUN npm run migrate
#RUN npm run seed
CMD ["npm", "run", "start:dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production
#RUN npm run migrate
#RUN npm run seed
CMD ["npm", "run", "start"]
