describe('products', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('details is listing all variants', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in details of the remain product
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    // Assert that details page is listing all variants
    cy.get('body')
      .should('contain', '000F_office_grey_jeans-variant-0')
      .and('contain', '000F_office_grey_jeans-variant-1')
      .and('contain', '000F_office_grey_jeans-variant-2')
      .and('contain', '000F_office_grey_jeans-variant-3')
      .and('contain', '000F_office_grey_jeans-variant-4');
  });

  it('deletar uma variante', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('111F patched jeans with fancy badges');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.clickInFirst('i.cubes.icon');
    cy.contains('i.list.icon + .text', 'List variants').click();
    cy.contains('button.ui.red.button', 'Delete').click()

    cy.get('body')
      .should('contain', '111F_patched_jeans_with_fancy_badges-variant-1')
      .and('contain', '111F_patched_jeans_with_fancy_badges-variant-2')
      .and('contain', '111F_patched_jeans_with_fancy_badges-variant-3')
      .and('contain', '111F_patched_jeans_with_fancy_badges-variant-4')
  });

  it('cria um item de teste', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.contains('span.text', 'Create').click();
    cy.contains('a.item', 'Simple product').click();
    cy.get('#sylius_product_code')
    .clear()
    .type('12345');
    cy.get('#sylius_product_translations_en_US_name')
    .clear()
    .type('teste');
    cy.contains('button', 'Create').click();
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('teste');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body')
      .should('contain', '12345')
  });

  it('Deve permitir editar um produto existente', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('Cashmere_blend_violet_beanie');
    cy.get('[class="ui blue labeled icon button"]').click();

    cy.contains('tr', 'Cashmere_blend_violet_beanie')
      .find('a[href="/edit"]')
      .click();

    cy.url().should('include', '/edit');
    cy.get('#sylius_product_code')
      .should('have.value', 'Cashmere_blend_violet_beanie');
  });

  it('Deve funcionar a paginação da tabela', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[class*="pagination menu"]').contains('2').click();
    cy.url().should('include', 'page=2');
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('muda disponibilidade do item', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('007M black elegance jeans ');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.clickInFirst('.ui.dropdown.button i.cubes.icon');
    cy.clickInFirst('a[href="/admin/products/17/variants"]');
    cy.clickInFirst('a[href="/admin/products/17/variants/95/edit"]');
    cy.contains('label', 'Enabled').click();
    cy.get('#sylius_save_changes_button').click();

    cy.get('table')
    .contains('tr', '007M_black_elegance_jeans-variant-0')
    .within(() => {
    cy.get('td').eq(2)
      .should('have.text', 'Disabled');
    });
  });

  it('Deve permitir buscar produtos', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('jeans');
    cy.get('[class*="ui blue labeled icon button"]').click();

    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).should('contain', 'jeans');
    });
  });
});

