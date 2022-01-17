Before running the tests install Cypress:
npm install cypress

Install plugins for Cypress:

npm install cypress-cucumber-preprocessor

npm install cypress-mailslurp

To run tests:
npx cypress run


Or in UI mode:
npx cypress open

Either there is a docker file with all dependencies, build the image and then run it