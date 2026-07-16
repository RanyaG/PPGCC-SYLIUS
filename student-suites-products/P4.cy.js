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
  it('more details (country)', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in details of the remain product
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    // Assert that details page is listing all countries
    cy.get('body')
      .should('contain', 'German (Germany)')
      .and('contain', 'English (United States)')
      .and('contain', 'Spanish (Spain)')
      .and('contain', 'Spanish (Mexico)')
      .and('contain', 'French (France)')
      .and('contain', 'Polish (Poland)')
      .and('contain', 'Portuguese (Portugal)')
      .and('contain', 'Chinese (China)');
  });
  it('breadcrumb generate variant', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in Manage Variants
    cy.clickInFirst('*[class^="ui labeled icon floating dropdown  link button"]');
    // Click em Generate
    cy.get('*[class^="menu transition visible"]').within(() => {
      cy.contains(' Generate').click();
    });

    const expected = ['Administration', 'Products', '000F office grey jeans', 'Variants', 'Generate'];

    // Assert generate variants page breadcrumb
    cy.get('*[class^="ui breadcrumb"]').within(() => {
      cy.get('a').each(($link, index) => {
        cy.wrap($link).should('have.text', expected[index]);
      });
    });
  });
  it('generate variant', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in Manage Variants
    cy.clickInFirst('*[class^="ui labeled icon floating dropdown  link button"]');
    // Click em generate
    cy.get('*[class^="menu transition visible"]').within(() => {
      cy.contains(' Generate').click();
    });
    // Click in generate
    cy.get('*[class^="ui labeled icon primary button"]').click();
    // Assert success message
    cy.get('body').should('contain', 'Success').and('contain', 'Product variants have been successfully generated.');
  });
  it('delete variant unsuccessfully', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in Manage Variants
    cy.clickInFirst('*[class^="ui labeled icon floating dropdown  link button"]');
    // Click em generate
    cy.get('*[class^="menu transition visible"]').within(() => {
      cy.contains(' Generate').click();
    });
    // Click in generate
    cy.get('*[class^="ui labeled icon primary button"]').click();
    // CLick in delete
    cy.get('form[action="/admin/products/20/variants/111"]').within(() => {
      cy.get('*[class^="ui red labeled icon button"]').click();
    });
    // Click in yes
    cy.get('*[class^="ui green ok inverted button"]').click();
    // Assert error message
    cy.get('body').should('contain', 'Error').and('contain', 'Cannot delete, the Product variant is in use.');
  });
  it('search for variant that does not exist', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in Manage Variants
    cy.clickInFirst('*[class^="ui labeled icon floating dropdown  link button"]');
    // Click em List Variants
    cy.get('*[class^="menu transition visible"]').within(() => {
      cy.contains(' List variants').click();
    });

    // Type in value input to search for specify variant
    cy.get('[id="criteria_code_value"]').type('123456notexist');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();

    //Assert no results message
    cy.get('body').should('contain', 'Info').and('contain', 'There are no results to display');
  });
  it('create simple product', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Click in create
    cy.clickInFirst('*[class^="ui labeled icon floating dropdown primary link button"]');
    // Click em Simple Product
    cy.contains(' Simple product').click();

    // Type in value input code
    cy.get('[id="sylius_product_code"]').type('123789');
    // Type in value input name
    cy.get('[id="sylius_product_translations_en_US_name"]').type('teste');
    cy.get('[id="sylius_product_translations_en_US_slug"]').type('teste');
    // Click in create button
    cy.get('*[class^="ui labeled icon primary button"]').click();

    //Assert success message
    cy.get('body').should('contain', 'Success').and('contain', 'Product has been successfully created.');
  });
  it('delete product', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('teste');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in delete
    cy.get('*[class^="ui buttons"]')
      .first()
      .within(() => {
        cy.get('*[class^="ui red labeled icon button"]').click();
      });
    cy.get('*[class^="ui green ok inverted button"]').click();

    //Assert success message
    cy.get('body').should('contain', 'Success').and('contain', 'Product has been successfully deleted.');
  });
});
