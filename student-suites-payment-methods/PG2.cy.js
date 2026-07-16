  describe('payment methods', () => {
    beforeEach(() => {
      cy.visit('/admin');
      cy.get('[id="_username"]').type('sylius');
      cy.get('[id="_password"]').type('sylius');
      cy.get('.primary').click();
    });

    it('change cash on delivery position', () => {
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

    it('Filter payment method by Equal Value', () => {
      cy.clickInFirst('a[href="/admin/payment-methods/"]');
      // Type in search input to search for Equal
      cy.get('[id="criteria_search_type"]').select('Equal');
      // Type in value input to search for specify payment method
      cy.get('[id="criteria_search_value"]').type('cash on delivery');
      // Click in filter blue button
      cy.get('*[class^="ui blue labeled icon button"]').click();
      // Assert that payment method table has only one element
      cy.get('table tbody tr').should('have.length', 1)
    })

    it('Clear payment methods filters', () => {
      cy.clickInFirst('a[href="/admin/payment-methods/"]');
      // Type in search input to search for Equal

      // Assert that payment method table has two elements
      cy.get('table tbody tr').should('have.length', 2)

      cy.get('[id="criteria_search_type"]').select('Equal');
      // Type in value input to search for specify payment method
      cy.get('[id="criteria_search_value"]').type('cash on delivery');
      // Click in filter blue button
      cy.get('*[class^="ui blue labeled icon button"]').click();
      // Assert that payment method table has only one element
      cy.get('table tbody tr').should('have.length', 1)
      // Click in Clear filters buttons
      cy.get('[class="ui labeled icon button"]').click();
      // Assert that payment method table has two elements
      cy.get('table tbody tr').should('have.length', 2)
    })

    it('Disable change chash payment method', () => {
        cy.clickInFirst('a[href="/admin/payment-methods/"]');
      // Type in value input to search for specify payment method
      cy.get('[id="criteria_search_value"]').type('cash');
      // Click in filter blue button
      cy.get('*[class^="ui blue labeled icon button"]').click();
      // Click in edit of the last payment method
      cy.get('*[class^="ui labeled icon button "]').last().click();
      // Disable payment method
      cy.get('[id="sylius_payment_method_enabled"]').click({force: true});
      // Click on Save changes button
      cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

      // Assert that payment method was disabled
      cy.get('body').should('contain', 'Payment method has been successfully updated.');
    })

    it('Update change chash payment method US instructions', () => {
      cy.clickInFirst('a[href="/admin/payment-methods/"]');
      // Type in value input to search for specify payment method
      cy.get('[id="criteria_search_value"]').type('cash');
      // Click in filter blue button
      cy.get('*[class^="ui blue labeled icon button"]').click();
      // Click in edit of the last payment method
      cy.get('*[class^="ui labeled icon button "]').last().click();
      // Change US description
      cy.get('[id="sylius_payment_method_translations_en_US_instructions"]').type("New instructions");
      // Click on Save changes button
      cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

      // Assert that payment method was disabled
      cy.get('body').should('contain', 'Payment method has been successfully updated.');
    })


    it('Enable change chash payment method', () => {
      cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Type in value input to search for specify payment method
    cy.get('[id="criteria_search_value"]').type('cash');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last payment method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Disable payment method
    cy.get('[id="sylius_payment_method_enabled"]').click({force: true});
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that payment method was disabled
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  })

  describe('Create Offline Payment Method', () => {
    it('should create an offline payment method', () => {
      // Visit the page to create a new offline payment method
      cy.visit('/admin/payment-methods/new/offline');
  
      // Fill in the code, name, and position
      cy.get('[id="sylius_payment_method_code"]').type('offline_method');
      cy.get('[id="sylius_payment_method_position"]').type('2');
  
      // Check the "Enabled?" option
      cy.get('[id="sylius_payment_method_enabled"]').check();
  
      // Fill in the name in English
      cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('Offline Payment Method (English)');
  
      // Click the "Create" button
      cy.contains('Create').click();
  
      // Verify if the offline payment method was created successfully
      cy.get('body').should('contain', 'Payment method has been successfully created.');
    });
  });
  
  describe('Disable Offline Payment Method', () => {
    it('should disable an offline payment method', () => {
      // Go to the page listing payment methods
      cy.visit('/admin/payment-methods');
  
      // Type in the search term
      cy.get('[id="criteria_search_value"]').type('offline_method');
  
      // Click the filter button
      cy.get('*[class^="ui blue labeled icon button"]').click();
  
      // Click the edit button of the last payment method
      cy.get('*[class="ui labeled icon button "]').last().click();
  
      // Uncheck the "Enabled" option
      cy.get('[id="sylius_payment_method_enabled"]').click({force: true});
  
      // Click the "Save changes" button
      cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
  
      // Verify if the payment method was successfully disabled
      cy.get('body').should('contain', 'Payment method has been successfully updated.');
    });
  });
  
  describe('Delete Offline Payment Method', () => {
    it('should delete an offline payment method', () => {
      // Visit the page to create a new offline payment method
      cy.clickInFirst('a[href="/admin/payment-methods/"]');
  
      cy.get('[id="criteria_search_value"]').type('offline');
  
      // Click the filter button
      cy.get('*[class^="ui blue labeled icon button"]').click();
  
      // Click the edit button of the last payment method
      cy.get('*[class="ui red labeled icon button"]').last().click();
  
      // Click the "Create" button
      cy.get('[id="confirmation-button"]').click();
  
      // Verify if the offline payment method was successfully deleted
      cy.get('body').should('contain', 'Payment method has been successfully deleted.');
    });
  });
  


    it('Update change chash payment method US instructions', () => {
      cy.clickInFirst('a[href="/admin/payment-methods/"]');
      // Type in value input to search for specify payment method
      cy.get('[id="criteria_search_value"]').type('cash');
      // Click in filter blue button
      cy.get('*[class^="ui blue labeled icon button"]').click();
      // Click in edit of the last payment method
      cy.get('*[class^="ui labeled icon button "]').last().click();
      // Change US description
      cy.get('[id="sylius_payment_method_translations_en_US_instructions"]').type("New instructions");
      // Click on Save changes button
      cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

      // Assert that payment method was disabled
      cy.get('body').should('contain', 'Payment method has been successfully updated.');
    })

    it('Disable change chash Fashion web Store method', () => {
      cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Type in value input to search for specify payment method
    cy.get('[id="criteria_search_value"]').type('cash');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last payment method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Disable payment method
    cy.get('[id="sylius_payment_method_enabled"]').click({force: true});
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that payment method was disabled
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  })  

  });