Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/admin');
  cy.get('[id="_username"]').type('sylius');
  cy.get('[id="_password"]').type('sylius');
  cy.get('.primary').click();
});

Cypress.Commands.add('navigateToCustomersList', () => {
  cy.clickInFirst('a[href="/admin/customers/"]');
});

Cypress.Commands.add('searchCustomers', (searchType, searchValue) => {
  cy.get('#criteria_search_type').select(searchType);
  cy.get('#criteria_search_value').type(searchValue);
  cy.get('*[class^="ui blue labeled icon button"]').click();
});

Cypress.Commands.add('clearInputAndType', (elementId, text) => {
  cy.get(elementId).scrollIntoView().clear().type(text);
});

Cypress.Commands.add('scrollIntoViewAndClick', (elementId) => {
  cy.get(elementId).scrollIntoView().click();
});

Cypress.Commands.add('verifyText', (element, text) => {
  cy.get(element).should('contain', text);
});

Cypress.Commands.add('verifyElementVisibility', (element) => {
  cy.get(element).should('be.visible');
});
Cypress.Commands.add('clicksCreateButton', (element) => {
  cy.get('.ui.right.floated.buttons').contains('Create').click();
});

Cypress.Commands.add('createNewCustomerWithError', (firstName) => {
  cy.clicksCreateButton();
  cy.get('label[for="sylius_customer_firstName"]').next().type(firstName);
  cy.get('button.ui.labeled.icon.primary.button:contains("Create")').click();
  cy.verifyElementVisibility('.ui.icon.negative.message');
});

Cypress.Commands.add('createNewCustomer', (firstName, lastName, email, phoneNumber) => {
  cy.clicksCreateButton();
  cy.get('label[for="sylius_customer_firstName"]').next().type(firstName);
  cy.get('label[for="sylius_customer_lastName"]').next().type(lastName);
  cy.get('label[for="sylius_customer_email"]').next().type(email);
  cy.get('label[for="sylius_customer_phoneNumber"]').next().type(phoneNumber);
  cy.get('button.ui.labeled.icon.primary.button:contains("Create")').click();
});

Cypress.Commands.add('clickShowButton', () => {
  cy.get('.ui.buttons a:contains("Show"):not(:contains("Show orders"))').first().click();
});

Cypress.Commands.add('impersonateCustomerAndVerifyConfirmation', (email) => {
  cy.searchCustomers('contains', email);
  cy.clickShowButton();
  cy.scrollIntoViewAndClick('*[class^="ui labeled icon button  blue"]');
  cy.verifyText('body', `Successfully impersonated customer ${email}.`);
});

Cypress.Commands.add('navigateToNewCustomerForm', () => {
  cy.visit('/admin/customers/new');
});

Cypress.Commands.add('cancelCreationAndVerifyNavigation', () => {
  cy.get('.ui.button').contains('Cancel').click();
  cy.url().should('include', '/admin/customers');
});

Cypress.Commands.add('checkNewsletterSubscriptionCheckbox', () => {
  cy.get('#sylius_customer_subscribedToNewsletter').should('exist').should('not.be.checked');
  cy.get('.ui.toggle.checkbox').contains('Subscribe to the newsletter').click();
  cy.get('#sylius_customer_subscribedToNewsletter').should('be.checked');
});

Cypress.Commands.add('viewCustomerDetailsByName', (name) => {
  cy.searchCustomers('contains', name);
  cy.clickShowButton();
});

Cypress.Commands.add('verifyCustomerDetails', (name, email, phoneNumber) => {
  cy.verifyText('body', name);
  cy.verifyText('body', email);
  cy.verifyText('body', phoneNumber);
});

Cypress.Commands.add('verifyCustomerNames', (...names) => {
  names.forEach((name) => {
    cy.verifyText('body', name);
  });
});

Cypress.Commands.add('deleteCustomerAndVerifyConfirmation', () => {
  cy.scrollIntoViewAndClick('*[class^="ui red labeled icon button"]');
  cy.verifyText('body', 'Are you sure you want to perform this action?');
});

Cypress.Commands.add('viewCustomerOrders', () => {
  cy.scrollIntoViewAndClick('.ui.labeled.icon.button:contains("Show orders")');
});
Cypress.Commands.add('clickEditButton', () => {
  cy.get('.ui.buttons a:contains("Edit")').first().click();
});

Cypress.Commands.add('filterOrdersByTotal', (greaterThan, lessThan) => {
  cy.clearInputAndType('#criteria_total_greaterThan', greaterThan);
  cy.clearInputAndType('#criteria_total_lessThan', lessThan);
  cy.scrollIntoViewAndClick('*[class^="ui blue labeled icon button"]');
});

Cypress.Commands.add('verifyOrder', (orderNumber) => {
  cy.verifyText('body', orderNumber);
});

Cypress.Commands.add('clickShowOrdersButton', () => {
  cy.get('.ui.buttons a:contains("Show orders")').first().click();
});
