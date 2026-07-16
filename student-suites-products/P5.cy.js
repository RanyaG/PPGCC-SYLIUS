describe('products', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  it('details is listing all variants', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
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

  it('starts with is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('[id="criteria_search_type"]').select('starts_with');
    cy.get('#criteria_search_value').type('9');
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    cy.get('body').should('contain', '911M_regular_fit_jeans').and('contain', '990M_regular_fit_jeans');
  });

  it('ends with is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('#criteria_search_type').select('ends_with');
    cy.get('#criteria_search_value').type('jeans');
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    cy.get('body')
      .should('contain', '911M_regular_fit_jeans')
      .and('contain', '990M_regular_fit_jeans')
      .and('contain', '000F_office_grey_jeans')
      .and('contain', '007M_black_elegance_jeans')
      .and('contain', '330M_slim_fit_jeans')
      .and('contain', '727F_patched_cropped_jeans');
  });

  it('contains is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('#criteria_search_type').select('contains');
    cy.get('#criteria_search_value').type('jeans');
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    cy.get('body')
      .should('contain', '911M_regular_fit_jeans')
      .and('contain', '990M_regular_fit_jeans')
      .and('contain', '000F_office_grey_jeans')
      .and('contain', '007M_black_elegance_jeans')
      .and('contain', '330M_slim_fit_jeans')
      .and('contain', '727F_patched_cropped_jeans');
  });

  it('equal with is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('#criteria_search_type').select('equal');
    cy.get('#criteria_search_value').type('000F_office_grey_jeans');
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    cy.get('body').should('contain', '000F_office_grey_jeans');
  });

  it('change display limit to 25 is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('div.ui.simple.fluid.dropdown.item').click();
    cy.get('div.menu').should('be.visible');
    cy.clickInFirst('a.item[href*="?limit=25"]');

    cy.url().should('include', 'limit=25');
  });

  it('page 3 button is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.clickInFirst('a[href="/admin/products/?page=3"]');

    cy.get('body').should('contain', 'Sport_basic_white_T_Shirt');
  });

  it('T-shirts-Men button is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.clickInFirst('a[href="/admin/products/taxon/3"]');

    cy.get('body').should('contain', 'Sport_basic_white_T_Shirt').and('contain', 'Raglan_grey_&_black_Tee').and('contain', 'Oversize_white_cotton_T_Shirt');
  });

  it('T-shirts-Women button is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.clickInFirst('a[href="/admin/products/taxon/4"]');

    cy.get('body').should('contain', 'Everyday_white_basic_T_Shirt').and('contain', 'Loose_white_designer_T_Shirt').and('contain', 'Ribbed_copper_slim_fit_Tee');
  });

  it('Jeans-Men button is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.clickInFirst('a[href="/admin/products/taxon/10"]');

    cy.get('body').should('contain', '911M_regular_fit_jeans').and('contain', '330M_slim_fit_jeans').and('contain', '990M_regular_fit_jeans').and('contain', '007M_black_elegance_jeans');
  });

  it('Jeans-women button is working', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.clickInFirst('a[href="/admin/products/taxon/11"]');

    cy.get('body').should('contain', '727F_patched_cropped_jeans').and('contain', '111F_patched_jeans_with_fancy_badges').and('contain', '000F_office_grey_jeans').and('contain', '666F_boyfriend_jeans_with_rips');
  });
});
