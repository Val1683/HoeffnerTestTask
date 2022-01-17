import {Given, And, When, Then, Before} from 'cypress-cucumber-preprocessor/steps'

Before(function () {
    cy.log("Wrap inbox before test")
    return cy.mailslurp()
        .then(mailslurp => mailslurp.createInbox())
        .then(inbox => {
            cy.log(`Inbox id ${inbox.id}`)
            // save inbox id and email address to this (make sure you use function and not arrow syntax)
            cy.wrap(inbox.id).as('inboxId')
            cy.wrap(inbox.emailAddress).as('emailAddress');
        })
});

Given('a Hoeffner login page [{string}]', function (loginPage) {
    cy.visit(loginPage);
});

When('I open a page', function () {
    cy.get('.consentForm__acceptButton').contains('Alle auswählen & bestätigen').click();
    cy.title().should('eq', "Höffner - Anmelden");
});

Then('I can see a newsletter subscription input', function () {
    cy.get('input#email').invoke('attr', 'placeholder').should('eq', "Ihre E-Mail-Adresse");
});

When('I enter my email in the input field', function () {
    cy.get('input#email').type(this.emailAddress);
});

And('I press {string} button', function (buttonTitle) {
    cy.get('button')
        .contains(buttonTitle).click();
});

Then('I can see a confirmation message that my subscription is in progress', function () {
    cy.get('.footerNewsletter__confirmation').find('span').invoke('text')
        .should('contains', "Nur noch ein Klick und Sie haben es geschafft!");
});

Then('I receive an email asking to confirm my email', function () {
    cy.mailslurp().then(mailslurp => mailslurp.waitForLatestEmail(this.inboxId)).then(
        email => {
            assert.isDefined(email);
            expect(email.subject).equal('Bitte bestätigen Sie Ihre Anmeldung!');
            cy.wrap(email.body).as('emailBody')
        });
});

When('I open the email', function () {
});

Then('There is a link to finish registration process', function () {
    let url = /a href=["']([^"']*)["']/g.exec(this.emailBody)[1];
    cy.wrap(url).as('completeUrl');
});

When('I click "Jetzt Anmeldung abschließen"', function () {
    cy.visit(this.completeUrl);
});

Then('I am redirected to page confirming subscription {string}',
    function (confirmingPage) {
        cy.location('pathname').should('eq', confirmingPage)
    });