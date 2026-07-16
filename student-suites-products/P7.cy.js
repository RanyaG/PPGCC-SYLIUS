describe('products', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement other test cases!
  it('details is listing all variants', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in details of the remain product
    cy.clickInFirst('*[class^="ui labeled icon button"]');

    // Assert that details page is listing all variants
    cy.get('body')
      .should('contain', '000F_office_grey_jeans-variant-0')
      .and('contain', '000F_office_grey_jeans-variant-1')
      .and('contain', '000F_office_grey_jeans-variant-2')
      .and('contain', '000F_office_grey_jeans-variant-3')
      .and('contain', '000F_office_grey_jeans-variant-4');
  });
  it('changes the name of a product', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[class="icon pencil"]').first().click();
    cy.get('[id="sylius_product_translations_en_US_name"]').clear().type('000F jeans cinza de escritório');
    cy.get('[id="sylius_save_changes_button"]').click();
    cy.clickInFirst('a[href="/admin/products/"]');

    cy.get('body').should('contain', '000F jeans cinza de escritório');
  });
  it('tries to delete a product in use', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_value"]').type('000F_office_grey_jeans');
    cy.get('[class="ui blue labeled icon button"]').click();
    cy.get('[class="icon trash"]').eq(1).scrollIntoView().click({ force: true });

    cy.get('body').should('contain', 'Cannot delete, the Product is in use.');
  });
  it("edits an item's variant", () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[class="ui labeled icon button "]').first().click();
    cy.get('[class="ui labeled icon button edit-variant"]').first().scrollIntoView().click();
    cy.wait(1000);
    cy.get('[id="sylius_product_variant_translations_en_US_name"]').clear().type('SAPATO');
    cy.get('[id="sylius_save_changes_button"]').click();

    cy.get('body').should('contain', 'SAPATO');
  });
  it("deletes an item's variant", () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[class="ui labeled icon button "]').first().click();
    cy.get('[class="ui labeled icon button edit-variant"]').first().scrollIntoView().click();
    cy.wait(1000);
    cy.get('[id="sylius_save_changes_button"]').click();
    cy.get('[class="icon trash"]').first().scrollIntoView().click({ force: true });
    cy.wait(100);
    cy.get('[id="confirmation-button"]').click();

    cy.get('body').should('contain', 'Product_variants have been successfully deleted.');
  });
  it("generates an item's variant", () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[class="cubes icon"]').first().click();
    cy.get('[class="random icon"]').first().click();
    cy.get('[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Product variants have been successfully generated.');
  });
  it('creates a simple product', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.contains('Create').click();
    cy.contains('Simple product').click();
    cy.get('[id="sylius_product_code"]').type('123');
    cy.get('[id="sylius_product_translations_en_US_name"]').type('product name');
    cy.get('[id="sylius_product_translations_en_US_slug"]').type('product-slug');
    cy.contains('Create').click();

    cy.get('body').should('contain', 'Product has been successfully created.');
  });
  it('changes the taxonomy', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.contains('Edit').first().click();
    cy.get('[data-tab="taxonomy"]').first().click();
    cy.get('[data-value="t_shirts"]').click();
    cy.contains('Save changes').click();

    cy.get('body').should('contain', 'Product has been successfully updated.');
  });
  it('adds an attribute', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.contains('Edit').first().click();
    cy.get('[data-tab="attributes"]').first().click();
    cy.get('[class="ui fluid search dropdown selection multiple"]').find('[class="dropdown icon"]').click();
    cy.contains('T-shirt brand').click({ force: true });
    cy.contains('Save changes').click();

    cy.get('body').should('contain', 'Product has been successfully updated.');
  });
  it('adds an association', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.contains('Edit').first().click();
    cy.get('[data-tab="associations"]').first().click();
    cy.get('[class="product-select ui fluid multiple search selection dropdown"]').click();
    cy.get('[class="item selected"]').first().click();
    cy.contains('Save changes').click();

    cy.get('body').should('contain', 'Product has been successfully updated.');
  });
  // Implement the remaining test cases in a similar manner
});
