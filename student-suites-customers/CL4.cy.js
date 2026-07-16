describe('customers', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('update a customer phone number', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer phone number
    cy.get('[id="sylius_customer_phoneNumber"]').scrollIntoView().clear().type('999.999.9999');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Name', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer name
    cy.get('[id="sylius_customer_firstName"]').scrollIntoView().clear().type('Test');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Last name', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer last name
    cy.get('[id="sylius_customer_lastName"]').scrollIntoView().clear().type('User');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Email', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer email
    cy.get('[id="sylius_customer_email"]').scrollIntoView().clear().type('test@example.com');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Group', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer group
    cy.get('[id="sylius_customer_group"]').scrollIntoView().select('Retail');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Gender', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer gender
    cy.get('[id="sylius_customer_gender"]').scrollIntoView().select('Male');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Birthday', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer birthday
    cy.get('[id="sylius_customer_birthday"]').scrollIntoView().type('1945-02-06');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Subscribe to newsletter', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer subscribed To Newsletter
    cy.get('label[for="sylius_customer_subscribedToNewsletter"]').scrollIntoView().click();
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Verified', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer verified
    cy.get('label[for="sylius_customer_user_verifiedAt"]').scrollIntoView().click();
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
  it('update a customer Enabled', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer enabled
    cy.get('label[for="sylius_customer_user_enabled"]').scrollIntoView().click();
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
});
