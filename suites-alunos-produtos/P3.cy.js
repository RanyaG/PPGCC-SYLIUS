describe('products', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.clickInFirst('a[href="/admin/products/"]');
  });

  it('details is listing all variants', () => {
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    cy.get('body')
      .should('contain', '000F_office_grey_jeans-variant-0')
      .and('contain', '000F_office_grey_jeans-variant-1')
      .and('contain', '000F_office_grey_jeans-variant-2')
      .and('contain', '000F_office_grey_jeans-variant-3')
      .and('contain', '000F_office_grey_jeans-variant-4');
  });

  it('should allow editing a product', () => {
    cy.get('[href="/admin/products/20/edit"]').click();
    cy.get('#sylius_product_translations_en_US_name').clear().type('new product jeans');
    cy.get('#sylius_save_changes_button').click();
    cy.get('.positive > .content > p').should('contain', 'Product has been successfully updated.');

    cy.get('body').should('contain', 'new product jeans');
  });

  it('should allow create a new product', () => {
    cy.get('.right > .ui').click();
    cy.get('[href="/admin/products/new/simple"]').click();
    cy.get('#sylius_product_code').click().type('produto1');
    cy.get('.segment > :nth-child(2) > .ui > label').click();
    cy.get('#sylius_product_translations_en_US_name').click().type('produto1');
    cy.get('#sylius_product_translations_en_US_slug').click().type('produto1');
    cy.get('.buttons > .labeled').click();
    cy.get('.positive > .content > p').should('contain', 'Product has been successfully created.');

    cy.get('body').should('contain', 'produto1');
  });

  it('should allow deleting a specific product', () => {
    cy.get('#criteria_search_value').click().type('produto1');
    cy.get(':nth-child(1) > .center > .bulk-select-checkbox').click();
    cy.get('.blue').click();
    cy.get('.bulk-select-checkbox').click();
    cy.get('.sylius-grid-nav__bulk > form > .ui').click();
    cy.get('#confirmation-button').click();

    cy.get('.positive > .content > p').should('contain', 'Products have been successfully deleted.');
  });

  it('should display pagination controls for product listing', () => {
    cy.get('.pagination').should('be.visible');
  });

  it('should allow filtering products by category', () => {
    cy.get('[data-id="2"] > :nth-child(1) > .sylius-tree__title > a').click();

    cy.get('body').should('contain', 'T-shirts');
  });

  it('should allow filtering products by status', () => {
    cy.get('#criteria_enabled').select('Yes');
    cy.get('.blue').click();

    cy.get('body').should('contain', 'Enabled');
  });

  it('should return correct product results when search', () => {
    cy.get('[id="criteria_search_value"]').type('jeans');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body').should('contain', 'jeans');
  });

  it('should not delete product in use', () => {
    cy.get(':nth-child(2) > .center > .bulk-select-checkbox').click();
    cy.get(':nth-child(1) > :nth-child(7) > :nth-child(1) > form > .ui').click();
    cy.get('#confirmation-button').click();

    cy.get('.negative > .content > p').should('contain', 'Cannot delete, the Product is in use.');
  });

  it('should clear filters when "Clean filters" is clicked', () => {
    cy.get('#criteria_search_value').click().type('Jeans');
    cy.get('.blue').click();
    cy.get('.loadable > a.ui').click();

    cy.get('body')
      .should('contain', '000F_office_grey_jeans')
      .and('contain', '007M_black_elegance_jeans')
      .and('contain', '111F_patched_jeans_with_fancy_badges')
      .and('contain', '330M_slim_fit_jeans')
      .and('contain', '666F_boyfriend_jeans_with_rips')
      .and('contain', '727F_patched_cropped_jeans')
      .and('contain', '911M_regular_fit_jeans')
      .and('contain', '990M_regular_fit_jeans')
      .and('contain', 'Beige_strappy_summer_dress')
      .and('contain', 'Cashmere_blend_violet_beanie');
  });
});
