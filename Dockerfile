# Base stage to have yarn installed
FROM node:20-alpine AS base

# Development stage to install dependencies and build the app
FROM base AS development 
ARG APP 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app 
COPY package.json yarn.lock ./ 
RUN yarn install
COPY . . 
RUN yarn build ${APP} 

# Production stage to serve the app
FROM base AS production 
ARG APP 
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV} 
EXPOSE 3000
WORKDIR /usr/src/app 
COPY package.json yarn.lock ./ 
RUN yarn install --production
COPY --from=development /usr/src/app/dist ./dist 

# Fix the path issue
ENV APP_MAIN_FILE=dist/apps/${APP}/main.js

# Run the app
CMD node ${APP_MAIN_FILE}
