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
  
  it('create simple product', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('.ui.right.floated.buttons').click();
    cy.clickInFirst('a[href="/admin/products/new/simple"]');
    cy.get('[id="sylius_product_code"]').type('123');
    cy.get('[id="sylius_product_translations_en_US_name"]').type('teste')
    cy.get('[id="sylius_product_translations_en_US_slug"]').type('teste')
    cy.get('.ui.labeled.icon.primary.button').click();
    // Assert
    cy.get('p')
    .should('contain', 'Product has been successfully created.');
  });

  it('edit product', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('123');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="icon pencil"]').click();
    cy.get('[id="sylius_product_variant_channelPricings_FASHION_WEB_price"]').type('10')
    cy.get('[id="sylius_save_changes_button"]').click();
    // Assert
    cy.get('p')
      .should('contain', 'Product has been successfully updated.');
  });

  it('delete product', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('123');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('.ui.red.labeled.icon.button:not(:disabled)').first().click();
    cy.get('[id="confirmation-button"]').click();
    // Assert
    cy.get('p')
      .should('contain', 'Product has been successfully deleted.');
  });

  it('create products', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('.ui.right.floated.buttons').click();
    cy.clickInFirst('a[href="/admin/products/new/simple"]');
    cy.get('[id="sylius_product_code"]').type('123');
    cy.get('[id="sylius_product_translations_en_US_name"]').type('teste')
    cy.get('[id="sylius_product_translations_en_US_slug"]').type('teste')
    cy.get('.ui.labeled.icon.primary.button').click();

    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('.ui.right.floated.buttons').click();
    cy.clickInFirst('a[href="/admin/products/new/simple"]');
    cy.get('[id="sylius_product_code"]').type('1234');
    cy.get('[id="sylius_product_translations_en_US_name"]').type('teste2')
    cy.get('[id="sylius_product_translations_en_US_slug"]').type('teste2')
    cy.get('.ui.labeled.icon.primary.button').click();

    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('body')
      .should('contain', 'teste')
      .and('contain', 'teste')
      .and('contain', 'teste2');
  })

  it('delete products', () => {

    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('123');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('input[type="checkbox"]').first().check();
    cy.get('.ui.red.labeled.icon.button').first().click();
    cy.get('[id="confirmation-button"]').click();
    // Assert
    cy.get('p')
      .should('contain', 'Products have been successfully deleted.');
  });
});
