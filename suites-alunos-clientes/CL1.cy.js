describe('customers', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.wait(500);
  });

  it('update a customer phone number', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
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
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('edit a customer password', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer password
    cy.get('[id="sylius_customer_user_plainPassword"]').scrollIntoView().clear().type('novasenha1234');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('deactivate a customer', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();

    // Click in deactivate customer
    cy.get('#user-form > div:nth-child(2) > div').click();

    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('verify a customer', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();

    // Click in verify customer
    cy.get('#user-form > div:nth-child(3) > div > label').click();

    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('change customer birthday', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();

    // Change customer birthday
    cy.get('#sylius_customer_birthday').scrollIntoView().clear().type('2001-09-09');

    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('change customer gender', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();

    // Change customer gender
    cy.get('#sylius_customer_gender').scrollIntoView().select('Male');

    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('update customer first name', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer phone number
    let newName = 'New Name Test';
    cy.get('[id="sylius_customer_firstName"]').scrollIntoView().clear().type(newName);
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('update customer last name', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer phone number
    let newLastName = 'New Last Test';
    cy.get('[id="sylius_customer_lastName"]').scrollIntoView().clear().type(newLastName);
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('update customer email', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer phone number
    let newEmail = 'new@email.com';
    cy.get('[id="sylius_customer_email"]').scrollIntoView().clear().type(newEmail);
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('update customer group', () => {
    // Click in customers in side menu
    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.wait(500);
    // Type in value input to search for specify customer
    cy.get('[id="criteria_search_value"]').type('@gmail');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last customer
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit customer phone number
    cy.get('[id="sylius_customer_group"]').scrollIntoView().select('Wholesale');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that customer has been updated
    cy.wait(500);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });
});
