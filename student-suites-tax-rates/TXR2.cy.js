describe('tax rates', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
  });
  
  // Remove .only and implement others test cases!
  it('validate filter applied through cancel button', () => {
    // Type in value input to search for specify tax rate
    cy.get('[id="criteria_search_value"]').type('7');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last tax rate
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Click on cancel button
    cy.get('.admin-layout__content > .ui > .ui > .ui > .ui:nth-child(2)').click();

    // Assert that we are back to the listing page with the filter applied
    cy.get('body').should('contain', 'Clothing Sales Tax 7%').and('not.contain', 'Sales Tax 20%');
  });

  it('validate tax rate creation with success', () => {
    cy.get('.right > .ui').click();
    cy.get('#sylius_tax_rate_code').type('clothing_new_tax');
    cy.get('#sylius_tax_rate_name').type('Clothing New Tax 5%');
    cy.get('#sylius_tax_rate_zone').select('United States of America');
    cy.get('#sylius_tax_rate_amount').clear().type('5');
    cy.get(':nth-child(4) > .ui > .required').click();
    cy.get('.buttons > .labeled').click();
    cy.get('.breadcrumb > [href="/admin/tax-rates/"]').click();
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('contain', 'clothing_new_tax');
    cy.removeNewTaxRate();
  });

  it('validate tax rate zone edition with success', () => {
    cy.createTaxRate();
    cy.get(':nth-child(1) > :nth-child(7) > .buttons > a.ui').click();
    cy.get('#sylius_tax_rate_zone').select('Rest of the World');
    cy.get('#sylius_save_changes_button').click();
    cy.get('.breadcrumb > [href="/admin/tax-rates/"]').click();
    cy.get('tbody > :nth-child(1) > :nth-child(4)').should('contain', 'Rest of the World');
    cy.removeNewTaxRate();
  });

  it('validate tax rate list after filter cleaning', () => {
    cy.get('[id="criteria_search_value"]').type('20');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('tbody > .item > :nth-child(2)').should('contain', 'sales_tax_20');
    cy.get('.loadable > a.ui').click();
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('contain', 'clothing_sales_tax_7');
  });

  it('validate tax rates filtered by date', () => {
    cy.createTaxRate();
    cy.get('#criteria_startDate_from_date').type('2023-10-01');
    cy.get('#criteria_startDate_from_time').type('10:00');
    cy.get('#criteria_endDate_from_date').type('2024-10-01');
    cy.get('#criteria_endDate_from_time').type('10:00');
    cy.get('.blue').click();
    cy.get('tbody > .item > :nth-child(2)').should('contain', 'clothing_new_tax').and('not.contain', 'Sales Tax 20%').and('not.contain', 'Clothing Sales Tax 7%');
    cy.removeNewTaxRate();
  });

  it('validate deletion of filtered tax rate', () => {
    cy.createTaxRate();
    cy.get('#criteria_search_type').select('Contains');
    cy.get('#criteria_search_value').type('5');
    cy.get('.blue').click();
    cy.get('.buttons > form > .ui').click();
    cy.get('#confirmation-button').click();
    cy.get('.loadable > a.ui').click();
    cy.get('.segment').should('not.contain', '5');
  });

  it('validate filter fields cleaning', () => {
    cy.get('[id="criteria_search_value"]').type('5');
    cy.get('#criteria_startDate_from_date').type('2023-10-01');
    cy.get('#criteria_startDate_from_time').type('10:00');
    cy.get('#criteria_endDate_from_date').type('2024-10-01');
    cy.get('#criteria_endDate_from_time').type('10:00');
    cy.get('.loadable > a.ui').click();
    cy.get('[id="criteria_search_value"]').should('not.contain','5');
    cy.get('#criteria_startDate_from_date').should('not.contain','2023-10-01');
    cy.get('#criteria_startDate_from_time').should('not.contain','10:00');
    cy.get('#criteria_endDate_from_date').should('not.contain','2024-10-01');
    cy.get('#criteria_endDate_from_time').should('not.contain','10:00');
  });

  it('validate filtering inexistent tax rate', () => {
    cy.get('[id="criteria_search_value"]').type('5');
    cy.get('#criteria_startDate_from_date').type('2023-10-01');
    cy.get('#criteria_startDate_from_time').type('10:00');
    cy.get('#criteria_endDate_from_date').type('2024-10-01');
    cy.get('#criteria_endDate_from_time').type('10:00');
    cy.get('.blue').click();
    cy.contains('There are no results to display'); 
  });

  it('validate creation with start date greater than end date', () => {
    cy.get('.right > .ui').click();
    cy.get('#sylius_tax_rate_code').type('clothing_new_tax');
    cy.get('#sylius_tax_rate_name').type('Clothing New Tax 5%');
    cy.get('#sylius_tax_rate_zone').select('United States of America');
    cy.get('#sylius_tax_rate_startDate_date').type('2024-10-01');
    cy.get('#sylius_tax_rate_startDate_time').type('10:00');
    cy.get('#sylius_tax_rate_endDate_date').type('2023-10-01');
    cy.get('#sylius_tax_rate_endDate_time').type('10:00');
    cy.get('#sylius_tax_rate_amount').clear().type('5');
    cy.get(':nth-child(4) > .ui > .required').click();
    cy.get('.buttons > .labeled').click();
    cy.get('.breadcrumb > [href="/admin/tax-rates/"]').click();
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('not.contain', 'clothing_new_tax');
  });

  it('validate tax rate error message while creating a tax with negative amount', () => {
    cy.get('.right > .ui').click();
    cy.get('#sylius_tax_rate_code').type('clothing_new_tax');
    cy.get('#sylius_tax_rate_name').type('Clothing New Tax 5%');
    cy.get('#sylius_tax_rate_zone').select('United States of America');
    cy.get('#sylius_tax_rate_amount').clear().type('-1');
    cy.get(':nth-child(4) > .ui > .required').click();
    cy.get('.buttons > .labeled').click();
    cy.contains('The tax rate amount is invalid.'); 
  });
  
});
