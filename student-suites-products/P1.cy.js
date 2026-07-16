describe('products', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.wait(1000);
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.wait(1000);
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.wait(1000);
  });
  // Remove .only and implement others test cases!
  it('details is listing all variants', () => {
    // Click in products in side menu
    //cy.clickInFirst('a[href="/admin/products/"]');
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

  it('Create a product', () => {
    cy.get('[class="ui labeled icon floating dropdown primary link button"]').click();
    cy.get('[href="/admin/products/new/simple"]').click();

    //
    cy.get('[id="sylius_product_code"]').type('12345');
    cy.get('[id="sylius_product_variant_channelPricings_FASHION_WEB_price"]').type('20,00');
    cy.get('[id="sylius_product_variant_channelPricings_FASHION_WEB_originalPrice"]').type('15,00');
    cy.get('[id="sylius_product_variant_channelPricings_FASHION_WEB_minimumPrice"]').type('19,00');
    cy.get('[id="sylius_product_translations_en_US_name"]').type('Dress');
    cy.get('[id="sylius_product_translations_en_US_slug"]').type('Red Dress');
    cy.get('[id="sylius_product_translations_en_US_description"]').type('A very beaultiful red dress');
    cy.get('[data-tab="taxonomy"]').first().click();
    cy.get('[data-value="dresses"]').click();

    cy.get('[data-tab="media"]').first().click();
    cy.get('[data-form-collection="add"]').click();
    cy.get('[class="ui icon labeled button"]').selectFile('cypress/fixtures/dress.jpg', { force: true });
    cy.get('[class="ui labeled icon primary button"]').click();
    cy.get('body').should('contain', 'Product has been successfully created.');
  });

  it('Create a variant', () => {
    cy.get('[id="criteria_search_value"]').type('12345');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('[class="cubes icon"]').click();
    cy.get('[class="plus icon"]').eq(3).click();
    cy.get('[id="sylius_product_variant_code"]').type('123456');

    cy.get('[id="sylius_product_variant_height"]').type('1');

    cy.get('[class="ui labeled icon primary button"]').click();
    cy.get('body').should('contain', 'Product variant has been successfully created.');
  });

  it('Edit a variant', () => {
    cy.get('[id="criteria_search_value"]').type('12345');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('[class="cubes icon"]').click();
    cy.get('[class="list icon"]').click();
    cy.get('[class="icon pencil"]').first().click();
    cy.get('[id="sylius_product_variant_translations_en_US_name"]').type('variant dress');

    cy.get('[id="sylius_save_changes_button"]').click();
    cy.get('body').should('contain', 'Product variant has been successfully updated.');
  });

  it('Delete a variant', () => {
    cy.get('[id="criteria_search_value"]').type('12345');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('[class="cubes icon"]').click();
    cy.get('[class="list icon"]').click();

    cy.get('input[type="checkbox"]').eq(1).click();
    cy.get('[class="ui red labeled icon button"]').first().click();
    cy.get('[class="ui green ok inverted button"]').click({ force: true });

    cy.get('body').should('contain', 'Product_variants have been successfully deleted.');
  });

  it('Edit a product', () => {
    cy.get('[id="criteria_search_value"]').type('12345');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('[class="icon pencil"]').click();

    cy.get('[id="sylius_product_translations_en_US_name"]').clear();
    cy.get('[id="sylius_product_translations_en_US_name"]').type('Dotted red dress');
    cy.get('[id="sylius_save_changes_button"]').click();

    cy.get('body').should('contain', 'Product has been successfully updated.');
  });

  it('Search a product', () => {
    cy.get('[id="criteria_search_type"]').select('equal');
    cy.get('[id="criteria_enabled"]').select('Yes');
    cy.get('[id="criteria_search_value"]').type('12345');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body').should('contain', 'Dotted red dress');
  });

  it('Search a inexistent product', () => {
    cy.get('[id="criteria_search_type"]').select('equal');
    cy.get('[id="criteria_enabled"]').select('Yes');
    cy.get('[id="criteria_search_value"]').type('inexistent');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body').should('contain', 'There are no results to display');
  });

  it('Open a prouct detail', () => {
    cy.get('[id="criteria_search_value"]').type('12345');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('[class="icon search"]').eq(1).click();
    cy.get('[id="more-details"]').click();
    cy.get('[id="more-details"]').should('contain', 'Dotted red dress').and('contain', 'dress').and('contain', 'A very beaultiful red dress');
  });

  it('Delete a product', () => {
    cy.get('[id="criteria_search_value"]').type('12345');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('[class="icon trash"]').eq(1).click();
    cy.get('[id="confirmation-button"]').click();

    cy.get('body').should('contain', 'Product has been successfully deleted.');
  });

  // Implement the remaining test cases in a similar manner
});
