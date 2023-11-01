#Stage 0: install base dependencies
FROM node:18-alpine3.17@sha256:b45e71e98bd0eecd4b694c7fb0281e08e06a384de26a986d241d348926692318 as dependencies

LABEL maintainer="Connor Squires <cwsquires@mysenca.ca>" \
      description="Fragments node.js microservice"

ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

#######################################################################

#Stage 1: Bring in the source code and deploy
FROM node:18-alpine3.17@sha256:b45e71e98bd0eecd4b694c7fb0281e08e06a384de26a986d241d348926692318 as deploy

WORKDIR /app

COPY --from=dependencies /app /app

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080
