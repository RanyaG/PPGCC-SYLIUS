describe('shipping methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('test case 1: change amount of fashion web store to fedex', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('fedex');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Type 9 in amount field of fashion web store
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').clear().type('9');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('test case 2: change position of fedex', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('fedex');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Type 0 in position of fashion web store
    cy.get('[id="sylius_shipping_method_position"]').clear().type('0');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('test case 3: create successfully', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Click in create
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Type Code in Code field
    cy.get('[id="sylius_shipping_method_code"]').clear().type('code');
    // Type Name in Name field
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').clear().type('Name');
    // Select Rest of the world in Zone
    cy.get('[id="sylius_shipping_method_zone"]').select(['Rest of the World'])
    // Type 9 in amount field of fashion web store
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').clear().type('9');
    
    // Click on Save changes button
    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    // Assert that shipping method has been created
    cy.get('body').should('contain', 'Shipping method has been successfully created.');
  });

  it('test case 4: create duplicate', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Click in create
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Type Code in Code
    cy.get('[id="sylius_shipping_method_code"]').clear().type('code');
    // Type Name in Name
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').clear().type('Name');
    // Select Rest of the world in Zone
    cy.get('[id="sylius_shipping_method_zone"]').select(['Rest of the World'])
    // Type 9 in amount field of fashion web store
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').clear().type('9');
    
    // Click on Save changes button
    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    // Assert that shipping method has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('test case 5: edit and create rule', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('code');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Click in Add rule
    cy.get('*[class^="plus square outline icon"]').last().click();
    // Type 100 in weight
    cy.get('[id="sylius_shipping_method_rules_0_configuration_weight"]').type('100');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('test case 6: archive successfully', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('code');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in archive of the last shipping method
    cy.get('*[class^="ui brown labeled icon button"]').last().click();
    // Click Yes
    cy.get('[id="confirmation-button"]').click();

    // Assert that shipping method has been archived
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('test case 7: restore (unarchive) successfully', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Select Archival Yes
    cy.get('[id="criteria_archival"]').select(['Yes'])
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('code');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in restore of the last shipping method
    cy.get('*[class^="ui brown labeled icon button"]').last().click();
    // Click Yes
    cy.get('[id="confirmation-button"]').click();

    // Assert that shipping method has been restored
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('test case 8: delete successfully', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('code');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in delete of the last shipping method
    cy.get('*[class^="ui red labeled icon button"]').last().click();
    // Click Yes
    cy.get('[id="confirmation-button"]').click();

    // Assert that shipping method has been deleted
    cy.get('body').should('contain', 'Shipping method has been successfully deleted.');
  });
  

  it('test case 9: try to change amount of fashion web store to fedex with an invalid valor', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('fedex');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Type invalid value in amount field of fashion web store
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').clear().type('invalid_value');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that shipping method has not been updated
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('test case 10: create unsuccessfully due to missing valor', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Click in create
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Type Code in Code
    cy.get('[id="sylius_shipping_method_code"]').clear().type('code');
    // Type Name in Name
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').clear().type('Name');
    // Select Rest of the world in Zone
    cy.get('[id="sylius_shipping_method_zone"]').select(['Rest of the World'])
    
    // Click on Save changes button
    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    // Assert that shipping method has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

});