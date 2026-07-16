describe('payment methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Teste 1
  it('change cash on delivery position', () => {
    // Click in payment methods in side menu
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Type in value input to search for specify payment method
    cy.get('[id="criteria_search_value"]').type('cash');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last payment method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Type 1 in position field
    cy.get('[id="sylius_payment_method_position"]').type('1');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that payment method has been updated
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });
  // Teste 2
  it('change bank transfer position', () => {
    
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('bank transfer');
    
    cy.get('*[class^="ui blue labeled icon button"]').click();
    
    cy.get('*[class^="ui labeled icon button "]').last().click();
    
    cy.get('[id="sylius_payment_method_position"]').clear().type('2');
    
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });
  // Teste 3
  it('delete cash on delivery payment method', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('cash');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('tr.item').contains('cash_on_delivery').parent().find('form button[type="submit"]').click();

    cy.get('#confirmation-button').click();
    
    cy.get('body').should('contain', 'Cannot delete, the Payment method is in use.');

  });
  // Teste 4
  it('create pix payment method', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');

    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();

    cy.get('#offline').click();

    cy.get('[id="sylius_payment_method_code"]').type('pix'); 

    cy.get('[id="sylius_payment_method_position"]').type('2');

    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('pix'); 

    cy.get('button.ui.labeled.icon.primary.button[type="submit"]').click();

    cy.get('body').should('contain', 'Payment method has been successfully created.');

  });
  // Teste 5
  it('change bank transfer position', () => {
    
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('pix');
    
    cy.get('*[class^="ui blue labeled icon button"]').click();
    
    cy.get('*[class^="ui labeled icon button "]').last().click();
    
    cy.get('[id="sylius_payment_method_position"]').clear().type('0');
    
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });
  // Teste 6
  it('disable pix payment method and add description', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('pix');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('*[class^="ui labeled icon button "]').last().click();

    cy.get('#sylius_payment_method_enabled').uncheck({ force: true });

    cy.get('[id="sylius_payment_method_translations_en_US_description"]').type('lorem ipsun'); 

    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    
    cy.get('body').should('contain', 'Payment method has been successfully updated.');

  });
  // Teste 7
  it('delete pix payment method', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('pix');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('tr.item').contains('pix').parent().find('form button[type="submit"]').click();

    cy.get('#confirmation-button').click();
    
    cy.get('body').should('contain', 'Payment method has been successfully deleted.');

  });
  // Teste 8
  it('delete bank transfer payment method', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('bank transfer');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('tr.item').contains('bank_transfer').parent().find('form button[type="submit"]').click();

    cy.get('#confirmation-button').click();
    
    cy.get('body').should('contain', 'Cannot delete, the Payment method is in use.');

  });
  // Teste 9
  it('disable cash on delivery payment method and edit description', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('cash');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('*[class^="ui labeled icon button "]').last().click();

    cy.get('#sylius_payment_method_enabled').uncheck({ force: true });

    cy.get('[id="sylius_payment_method_translations_en_US_description"]').clear().type('nova descricao'); 

    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    
    cy.get('body').should('contain', 'Payment method has been successfully updated.');

  });
  // Teste 10
  it('disable bank transfer payment method and edit description', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('bank transfer');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('*[class^="ui labeled icon button "]').last().click();

    cy.get('#sylius_payment_method_enabled').uncheck({ force: true });

    cy.get('[id="sylius_payment_method_translations_en_US_description"]').clear().type('nova descricao'); 

    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    
    cy.get('body').should('contain', 'Payment method has been successfully updated.');

  });
});
