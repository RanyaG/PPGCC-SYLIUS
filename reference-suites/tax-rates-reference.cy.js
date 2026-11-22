/// <reference types="cypress" />

const ADMIN = { user: 'sylius', pass: 'sylius' };
const routes = { list: '/admin/tax-rates/', new: '/admin/tax-rates/new' };
let seed;
let seedName;
const sel = {
  rows: 'table tbody tr.item',
  searchType: '#criteria_search_type',
  searchValue: '#criteria_search_value',
  filter: 'button.ui.blue.labeled.icon.button',
  code: '#sylius_tax_rate_code',
  name: '#sylius_tax_rate_name',
  category: '#sylius_tax_rate_category',
  zone: '#sylius_tax_rate_zone',
  amount: '#sylius_tax_rate_amount',
};

function ensureLoggedIn() {
  cy.session([ADMIN.user, ADMIN.pass], () => {
    cy.login(ADMIN.user, ADMIN.pass);
    cy.location('pathname', { timeout: 30000 }).should('not.include', '/login');
  }, {
    validate() {
      cy.visit('/admin');
      cy.location('pathname').should('not.include', '/login');
    },
  });
}

function selectFirstValue(selector) {
  cy.get(`${selector} option`).then(($options) => {
    const option = [...$options].find((item) => item.value);
    expect(option, `opcao disponivel em ${selector}`).to.exist;
    cy.get(selector).select(option.value);
  });
}

function fillRate({ code = seed, name = seedName, amount = '10' } = {}) {
  if (code !== null) cy.get(sel.code).type(code);
  if (name !== null) cy.get(sel.name).type(name);
  selectFirstValue(sel.category);
  selectFirstValue(sel.zone);
  cy.get(sel.amount).clear().type(amount);
}

function filterRate(type, value) {
  cy.visit(routes.list);
  cy.get(sel.searchType).select(type);
  cy.get(sel.searchValue).type(value);
  cy.get(sel.filter).click();
}

function rowFor(value = seed) {
  return cy.get(sel.rows).contains('tr', value);
}

function createFixture() {
  cy.visit(routes.new);
  fillRate();
  cy.get('button.ui.primary.button').click();
  cy.get('body').should('contain', 'Tax rate has been successfully created.');
}

describe('Referencia - Tax Rates (Admin, Sylius 1.x)', () => {
  beforeEach(() => {
    ensureLoggedIn();
    const suffix = Cypress._.uniqueId(String(Date.now()) + '_');
    seed = 'REF_TAX_' + suffix;
    seedName = 'Reference Tax ' + suffix;
  });

  it('cria uma taxa valida', () => {
    cy.visit(routes.list);
    cy.get('a[href$="/tax-rates/new"], a[href$="/tax-rates/new/"]')
      .should('be.visible').click();
    cy.location('pathname').should('match', /\/new\/?$/);
    fillRate();
    cy.get('button.ui.primary.button').click();
    cy.get('body').should('contain', 'Tax rate has been successfully created.');
  });

  it('aceita aliquota zero e persiste a taxa', () => {
    cy.visit(routes.new);
    fillRate({ amount: '0' });
    cy.get('button.ui.primary.button').click();
    cy.get('body').should('contain', 'Tax rate has been successfully created.');
    filterRate('equal', seedName);
    rowFor().contains('a', 'Edit').click();
    cy.get(sel.amount).should(($amount) => {
      const value = String($amount.val()).trim();
      expect(value, 'aliquota salva').to.match(/^0+(?:[.,]0+)?$/);
    });
  });

  it('rejeita taxa com codigo duplicado', () => {
    createFixture();
    cy.visit(routes.new);
    fillRate({ name: `${seedName} Duplicate` });
    cy.get('button.ui.primary.button').click();
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('rejeita taxa com codigo vazio', () => {
    cy.visit(routes.new);
    fillRate({ code: null, name: 'Reference Missing Code' });
    cy.get('button.ui.primary.button').click();
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('rejeita taxa com nome vazio', () => {
    cy.visit(routes.new);
    fillRate({ code: `${seed}_missing_name`, name: null });
    cy.get('button.ui.primary.button').click();
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('rejeita taxa com valor negativo', () => {
    cy.visit(routes.new);
    fillRate({ code: `${seed}_negative`, name: 'Reference Negative', amount: '-1' });
    cy.get('button.ui.primary.button').click();
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('filtra a taxa por igualdade', () => {
    createFixture();
    filterRate('equal', seed);
    cy.get(sel.rows).should('have.length', 1).and('contain.text', seed);
  });

  it('filtra a taxa por trecho do codigo', () => {
    createFixture();
    filterRate('contains', seed.slice(2));
    cy.get(sel.rows).should('contain.text', seed);
  });

  it('exibe estado vazio para taxa inexistente', () => {
    filterRate('equal', 'REFERENCE_TAX_NOT_FOUND');
    cy.get('body').should('contain', 'There are no results to display');
  });

  it('edita o nome da taxa criada', () => {
    createFixture();
    filterRate('equal', seed);
    rowFor().contains('a', 'Edit').click();
    cy.get(sel.name).clear().type(`${seedName} Updated`);
    cy.get('button.ui.primary.button').click();
    cy.get('body').should('contain', 'Tax rate has been successfully updated.');
  });

  it('exclui a taxa criada para a suite', () => {
    createFixture();
    filterRate('equal', seed);
    rowFor().find('.ui.red.labeled.icon.button').click();
    cy.get('#confirmation-button').click();
    cy.get('body').should('contain', 'Tax rate has been successfully deleted.');
    cy.get(sel.rows).should('not.exist');
  });
});
