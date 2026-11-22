describe('tax rates', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  it('1 - validate filter applied through cancel button', () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    cy.get('[id="criteria_search_value"]').type('7');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('.admin-layout__content > .ui > .ui > .ui > .ui:nth-child(2)').click();
    cy.get('body').should('contain', 'Clothing Sales Tax 7%').and('not.contain', 'Sales Tax 20%');
  });

  it('2-validate adding a new tax rate', () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    cy.contains('Tax rates').click();
    cy.contains('Create').click();
    cy.get('#sylius_tax_rate_code').type('NEW_TAXING');
    cy.get('#sylius_tax_rate_name').type('NEW_TAX');
    cy.get('#sylius_tax_rate_zone').select('United States of America');
    cy.get('#sylius_tax_rate_amount').type('10');
    cy.get('#sylius_tax_rate_category').type('Reduced rate');
    cy.get('.ui.primary.button').click();

    cy.contains('Tax rate has been successfully created.').should('exist');
  });

  it('validate editing an existing tax rate', () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('#sylius_tax_rate_name').clear().type('UPDATED_TAX');
    cy.get('.ui.primary.button').click();
    cy.get('body').should('contain', 'Tax rate has been successfully updated.');
  });

  it('validate deleting an existing tax rate', () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    cy.get('.ui.red.labeled.icon.button').last().click();
    cy.get('.ui.green.ok.inverted.button').last().click();
    cy.get('body').should('contain', 'Tax rate has been successfully deleted.');
  });

  it('5-validate adding a new tax rate and cancelling', () => {
    cy.contains('Tax rates').click();
    cy.contains('Create').click();
    cy.get('#sylius_tax_rate_code').type('NEW_TAX');
    cy.get('#sylius_tax_rate_name').type('NEW_TAX');
    cy.get('#sylius_tax_rate_zone').select('United States of America');
    cy.get('#sylius_tax_rate_amount').type('10');
    cy.contains('Cancel').click();

    cy.contains('filter').should('exist');
  });

  it('6-validate adding a new tax rate with an empty code', () => {
    cy.contains('Tax rates').click();
    cy.contains('Create').click();
    cy.get('#sylius_tax_rate_name').type('NEW_TAX');
    cy.get('#sylius_tax_rate_zone').select('United States of America');
    cy.get('#sylius_tax_rate_amount').type('10');
    cy.get('.ui.primary.button').click();

    cy.contains('This form contains errors.').should('exist');
  });

  it('7-validate adding a new tax rate with start date', () => {
    cy.contains('Tax rates').click();
    cy.contains('Create').click();
    cy.get('#sylius_tax_rate_code').type('NEW_TAXESV2');
    cy.get('#sylius_tax_rate_name').type('NEW_TAX');
    cy.get('#sylius_tax_rate_zone').select('United States of America');
    cy.get('#sylius_tax_rate_amount').type('10');
    cy.get('#sylius_tax_rate_startDate_date').clear().type('2001-12-12');
    cy.get('#sylius_tax_rate_startDate_time').type('12:34');
    cy.get('.ui.primary.button').click();
    cy.contains('Tax rate has been successfully created.').should('exist');
  });

  it('8-validate filter applied and editing', () => {
    cy.contains('Tax rates').click();
    cy.get('#criteria_search_value').type('NEW_TAX');
    cy.get('.ui.blue.labeled.icon.button').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('#sylius_tax_rate_amount').type('234');
    cy.get('.ui.primary.button').click();
    cy.contains('Tax rate has been successfully updated').should('exist');
  });

  it('9-validate filter applied and delete selection', () => {
    cy.contains('Tax rates').click();
    cy.get('#criteria_search_value').type('2');
    cy.get('.ui.blue.labeled.icon.button').click();
    cy.get('.ui.red.labeled.icon.button').last().click();
    cy.get('.ui.green.ok.inverted.button').last().click();
    cy.contains('Tax rate has been successfully deleted.').should('exist');
  });

  it('10-validate filter applied but has no valid results', () => {
    cy.contains('Tax rates').click();
    cy.get('#criteria_search_value').type('7');
    cy.get('.ui.blue.labeled.icon.button').click();
    cy.get('#criteria_startDate_from_date').clear().type('2001-12-12');
    cy.get('#criteria_startDate_from_time').type('12:34');
    cy.contains('There are no results to display').should('exist');
  });
});