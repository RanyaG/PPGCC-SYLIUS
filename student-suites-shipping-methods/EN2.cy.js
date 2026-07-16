describe('shipping methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('change amount of fashion web store to fedex', () => {
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
  it('Adicionando shipping com taxa clothing e com zona para todo o mundo', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.contains('Create').click();
    cy.get('[id="sylius_shipping_method_code"]').type('teste1');
    cy.get('[id="sylius_shipping_method_position"]').type('0');
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').type('FedEx Carrier');
    cy.get('#sylius_shipping_method_zone').select('WORLD');
    cy.get('#sylius_shipping_method_taxCategory').select('clothing')
    cy.get('#sylius_shipping_method_calculator').select('flat_rate')
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').type('10');
    cy.contains('Create').click();
    cy.get('body').should('contain', 'Shipping method has been successfully created.');
  });
  it('Adicionando shipping com taxa other, zona para Estados Unidos e calculo por unidade', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.contains('Create').click();
    cy.get('[id="sylius_shipping_method_code"]').type('test2');
    cy.get('[id="sylius_shipping_method_position"]').type('0');
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').type('FedEx Carrier');
    cy.get('#sylius_shipping_method_zone').select('US');
    cy.get('#sylius_shipping_method_taxCategory').select('other')
    cy.get('#sylius_shipping_method_calculator').select('per_unit_rate')
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').type('10');
    cy.contains('Create').click();
    cy.get('body').should('contain', 'Shipping method has been successfully created.');
  });

  it('Adicionando shipping com taxa clothing, zona para Estados Unidos, calculo por unidade e regra de peso', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.contains('Create').click();
    cy.get('[id="sylius_shipping_method_code"]').type('test3');
    cy.get('[id="sylius_shipping_method_position"]').type('0');
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').type('FedEx Carrier');
    cy.get('#sylius_shipping_method_zone').select('US');
    cy.get('#sylius_shipping_method_taxCategory').select('other')
    cy.get('#sylius_shipping_method_calculator').select('per_unit_rate')
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').type('10');
    cy.contains('Create').click();
    cy.get('body').should('contain', 'Shipping method has been successfully created.');
  });

  it('Delete a shipping method', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
  // Localize todos os formulários de shipping methods na página
    cy.get('form[action^="/admin/shipping-methods"]').then(forms => {
      // Verifique se há pelo menos um formulário presente
      if (forms.length > 2) { // Se houver pelo menos 3 formulários (índices 0, 1, 2)
        cy.wrap(forms[2]).within(() => {
          cy.contains('button.ui.red.labeled.icon.button', 'Delete').click();
        });

        cy.get('#confirmation-modal').should('be.visible');

        // Clique no botão "Yes" no modal de confirmação
        cy.get('#confirmation-button').click();

        // Aguarde a mensagem de confirmação de exclusão
        cy.contains('Shipping method has been successfully deleted.').should('exist');
    };
  })});
  it('Editando Shipping charges', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.get('a[href="/admin/shipping-methods/2/edit"]').click();
    cy.get('#sylius_shipping_method_taxCategory').select('other')
    cy.get('#sylius_shipping_method_calculator').select('per_unit_rate')
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').type('40');
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('Editando nome e descricao', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.get('a[href="/admin/shipping-methods/2/edit"]').click();
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').type('Test Carrier');
    cy.get('[id="sylius_shipping_method_translations_en_US_description"]').type('test desc');   
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('Arquivando shipping', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.get('form[action="/admin/shipping-methods/1/archive"]').within(() => {
      // Alterar o método para PATCH (se necessário)
      cy.get('input[name="_method"]').invoke('attr', 'value', 'PATCH');
  
      cy.get('button[type="submit"]').click();
    });

    cy.get('.ui.basic.modal.visible').within(() => {
      cy.contains('Are you sure you want to perform this action?');

      cy.get('#confirmation-button').click();
    });
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });

  it('Criando com RULE de config weigth', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.contains('Create').click();
    cy.get('[id="sylius_shipping_method_code"]').type('testcard');
    cy.get('[id="sylius_shipping_method_position"]').type('0');
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').type('FedEx Carrier');
    cy.get('#sylius_shipping_method_zone').select('WORLD');
    cy.get('#sylius_shipping_method_taxCategory').select('clothing')
    cy.get('#sylius_shipping_method_calculator').select('flat_rate')
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').type('10');
    cy.get('[data-form-collection="add"]').click();
    cy.get('[id="sylius_shipping_method_rules_0_configuration_weight"]').type('12');
    cy.contains('Create').click();
  })

  it('Criando com RULE de item order', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.contains('Create').click();
    cy.get('[id="sylius_shipping_method_code"]').type('dresscard');
    cy.get('[id="sylius_shipping_method_position"]').type('0');
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').type('FedEx Carrier');
    cy.get('#sylius_shipping_method_zone').select('WORLD');
    cy.get('#sylius_shipping_method_taxCategory').select('clothing')
    cy.get('#sylius_shipping_method_calculator').select('flat_rate')
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').type('10');
    cy.get('[data-form-collection="add"]').click();
    cy.get('#sylius_shipping_method_rules_0_type').select("order_total_greater_than_or_equal")
    cy.get('[id="sylius_shipping_method_rules_0_configuration_FASHION_WEB_amount"]').type('20');
    cy.contains('Create').click();
  })

  it('Adicionando shipping com taxa clothing, zona para Estados Unidos, calculo por unidade e regra de peso', () => {
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    cy.contains('Create').click();
    cy.get('[id="sylius_shipping_method_code"]').type('test5');
    cy.get('[id="sylius_shipping_method_position"]').type('0');
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').type('FedEx Carrier');
    cy.get('#sylius_shipping_method_zone').select('US');
    cy.get('#sylius_shipping_method_taxCategory').select('other')
    cy.get('#sylius_shipping_method_calculator').select('per_unit_rate')
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').type('10');
    cy.get('[data-form-collection="add"]').click();
    cy.get('[id="sylius_shipping_method_rules_0_configuration_weight"]').type('12');
    cy.contains('Create').click();
    cy.get('body').should('contain', 'Shipping method has been successfully created.');
  });
});