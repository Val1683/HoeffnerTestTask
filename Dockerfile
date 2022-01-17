FROM cypress/base:10

WORKDIR /app

COPY ./cypress ./cypress
COPY ./cypress.json ./cypress.json
COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm i
CMD npx cypress run

