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
  it('test case 2 - Disable dhl_express method', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('dhl_express');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Click to activate the method
    cy.clickInFirst('[class="ui toggle checkbox"]');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');

    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('dhl_express');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('tr[class^="item"]').contains('Disabled');

    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Click to activate the method
    cy.clickInFirst('[class="ui toggle checkbox"]');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
  });
  it('test case 3 - add rule to dhl_express method', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('dhl_express');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last shipping method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Click to activate the method
    cy.contains('Add rule').click();
    // Set rule weight
    cy.contains('Weight').parent().children('input').clear().type('12');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });
  it('test case 4 - archive dhl_express shipping method', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('dhl_express');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in archive of the last shipping method
    cy.get('form[name^="sylius_archivable"]').click();
    // Click yes to confirm Archive
    cy.get('*[class^="ui green ok inverted button"]').click();

    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully updated.');
  });
  it('test case 5 - create teste shipping method', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Click in create button
    cy.contains('Create').click();

    // Type 76544321 in code field
    cy.get('[id="sylius_shipping_method_code"]').clear().type('76544321');

    // Type 123 in shipping method name field
    cy.get('[id="sylius_shipping_method_translations_en_US_name"]').clear().type('teste');

    // Type US in Zone field
    cy.get('[id="sylius_shipping_method_zone"]').select('US');

    // Type 8 in amount field of fashion web store
    cy.get('[id="sylius_shipping_method_configuration_FASHION_WEB_amount"]').clear().type('9');

    // Click button to create the shipping method
    cy.contains('Create').click();

    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully created.');
  });
  it('test case 6 - Delete teste shipping method', () => {
    // Click in shipping methods in side menu
    cy.clickInFirst('a[href="/admin/shipping-methods/"]');
    // Type in value input to search for specify shipping method
    cy.get('[id="criteria_search_value"]').type('teste');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Click in Delete button
    cy.get('input[value^="DELETE"]').parent().last().scrollIntoView().click();
    // Click yes to confirm Remove
    cy.get('*[class^="ui green ok inverted button"]').click();

    // Assert that shipping method has been updated
    cy.get('body').should('contain', 'Shipping method has been successfully deleted.');
  });
  it('test case 7 - should redirect to new shipping method page on create click', () => {
    // Acessa a página
    cy.visit('/admin/');

    // Localiza a tag <a> pelo texto e clica nela
    cy.contains('Shipping methods').click();

    // Verifica o redirecionamento para outra URL
    cy.url().should('eq', 'http://localhost:9990/admin/shipping-methods/');

    // Verifica se o botão de criar existe e clica nele
    cy.contains('Create').click();

    // Verifica o redirecionamento para outra URL
    cy.url().should('eq', 'http://localhost:9990/admin/shipping-methods/new');

    // Verifica se o título da página é o esperado
    cy.get('h1.ui.header').contains('New shipping method');
  });
  it('test case 8 - should use Ends with filter correctly', () => {
    cy.visit('/admin/shipping-methods/');

    // Seleciona a opção "Ends with" no select
    cy.get('select#criteria_search_type').select('ends_with');

    // Digita "ps" no campo de Value
    cy.get('input#criteria_search_value').type('ps');

    // Clica no botão Filter
    cy.get('button.ui.blue.labeled.icon.button[type="submit"]').contains('Filter').click();

    // Verifica se as colunas da tabela contêm os textos corretos
    cy.get('table.ui.sortable.stackable.very.basic.celled.table tbody tr.item')
      .should('have.length', 1)
      .within(() => {
        cy.get('td').eq(2).should('have.text', 'ups');
        cy.get('td').eq(3).should('have.text', 'UPS');
        cy.get('td').eq(4).should('have.text', 'United States of America');
      });
  });
  it('test case 9 - should clear filters', () => {
    cy.visit('/admin/shipping-methods/');
    // Seleciona a opção "Ends with" no select
    cy.get('select#criteria_search_type').select('ends_with');

    // Digita "ps" no campo de Value
    cy.get('input#criteria_search_value').type('ps');

    // Clica no botão Filter
    cy.get('button.ui.blue.labeled.icon.button[type="submit"]').contains('Filter').click();

    // Verifica se as colunas da tabela contêm os textos corretos
    cy.get('table.ui.sortable.stackable.very.basic.celled.table tbody tr.item')
      .should('have.length', 1)
      .within(() => {
        cy.get('td').eq(2).should('have.text', 'ups');
        cy.get('td').eq(3).should('have.text', 'UPS');
        cy.get('td').eq(4).should('have.text', 'United States of America');
      });

    // Limpa os filtros
    cy.get('a.ui.labeled.icon.button').contains('Clear filters').click();

    // Verifica se existe na tabela 2 rows que é o total de rows da tabela no momento do teste
    cy.get('table.ui.sortable.stackable.very.basic.celled.table tbody tr.item').should('have.length', 2);
  });
  it('test case 10 - should re order on sort button click', () => {
    cy.visit('/admin/shipping-methods/');

    // Checa se a ordem está na padrão
    cy.get('tbody tr.item').first().should('contain', '0').next().should('contain', '2');

    // Clicar no ordenador "Position"
    cy.get('th.sylius-table-column-position a').click();

    // Verificar se a ordem mudou de "0,2" para "2,0"
    cy.get('tbody tr.item').first().should('contain', '2').next().should('contain', '0');
  });
});
