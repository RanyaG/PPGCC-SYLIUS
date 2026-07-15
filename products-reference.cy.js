/// <reference types="cypress" />
const crypto = require('crypto');

const ADMIN = { user: 'sylius', pass: 'sylius' };

function rand() {
  return crypto.randomBytes(20).toString('hex').substring(0, 8);
}

const routes = {
  list: '/admin/products/',
  newSimple: '/admin/products/new/simple',
};

const sel = {
  form: {
    code: '#sylius_product_code',
    name: '#sylius_product_translations_en_US_name',
    slug: '#sylius_product_translations_en_US_slug',
    price: '#sylius_product_variant_channelPricings_FASHION_WEB_price',
    submit: '.primary',
    saveChanges: '#sylius_save_changes_button',
  },
  flash: '.sylius-flash-message',
  filter: {
    search: '#criteria_search_value',
    apply: '.sylius-filters ~ .icon.button > .icon.search',
  },
  grid: {
    rows: 'div.sylius-grid-table-wrapper table tbody tr',
  },
  noResultsText: 'There are no results to display',
};

function ensureLoggedIn() {
  cy.session(
    [ADMIN.user, ADMIN.pass],
    () => {
      cy.login(ADMIN.user, ADMIN.pass);
      cy.location('pathname', { timeout: 30000 }).should('not.include', '/login');
    },
    {
      validate() {
        cy.visit('/admin');
        cy.location('pathname', { timeout: 30000 }).should('not.include', '/login');
      },
    }
  );
}

function seedSimpleProduct() {
  const code = rand();
  cy.visit(routes.newSimple);
  cy.get(sel.form.code).type(code);
  cy.get(sel.form.price).type('40');
  cy.get(sel.form.name).type(rand());
  cy.get(sel.form.slug).clear().type(code);
  cy.get(sel.form.submit).click();
  cy.get(sel.flash).should('contain', 'successfully created');
  return cy.wrap(code);
}

/**
 * Submete o formulario de criacao e verifica que o produto NAO foi criado.
 * Robusto a instabilidade de sessao: nao checa URL (que poderia virar /login),
 * apenas confirma que NAO apareceu a flash de sucesso de criacao.
 *
 * IMPORTANTE: tambem falha se a pagina virar um erro 500/crash do servidor.
 * Um crash NAO e uma rejeicao valida de validacao - e um bug diferente.
 */
function assertNotCreated() {
  cy.get(sel.form.submit).click();
  cy.get('body').should(($body) => {
    const text = $body.text();
    expect(text, 'nao deveria mostrar sucesso na criacao').to.not.contain('successfully created');
    expect(text, 'nao deveria crashar com erro interno do servidor').to.not.contain('Internal Server Error');
    expect(text, 'nao deveria mostrar excecao do Symfony').to.not.contain('Whoops, looks like something went wrong');
  });
}

// ===================================================================
describe('Referencia - Products (Admin, Sylius 1.x)', () => {
  beforeEach(() => {
    ensureLoggedIn();
  });

  // ---------- CRIAÇÃO (Partição por Equivalência - Robusto Fraco) ----------
  describe('Criacao de produto', () => {
    // [PE Robusto Fraco - caso totalmente valido] (C1)
    it('cria um produto simples com campos validos', () => {
      const code = rand();
      cy.visit(routes.newSimple);
      cy.get(sel.form.code).type(code);
      cy.get(sel.form.price).type('40');
      cy.get(sel.form.name).type(rand());
      cy.get(sel.form.slug).clear().type(code);
      cy.get(sel.form.submit).click();

      cy.get(sel.flash).should('contain', 'successfully created');
      cy.visit(routes.list);
      cy.get(sel.filter.search).type(code);
      cy.get(sel.filter.apply).click();
      cy.get(sel.grid.rows).should('contain.text', code);
    });

    // [PE Robusto Fraco - classe invalida isolada: Codigo obrigatorio] (C1)
    it('rejeita criacao com Codigo vazio', () => {
      cy.visit(routes.newSimple);
      cy.get(sel.form.price).type('40');
      cy.get(sel.form.name).type(rand());
      cy.get(sel.form.slug).clear().type(rand());
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida isolada: Nome obrigatorio] (C1)
    it('rejeita criacao com Nome vazio', () => {
      cy.visit(routes.newSimple);
      cy.get(sel.form.code).type(rand());
      cy.get(sel.form.price).type('40');
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida: unicidade do Codigo] (C1)
    it('rejeita Codigo duplicado', () => {
      seedSimpleProduct().then((code) => {
        cy.visit(routes.newSimple);
        cy.get(sel.form.code).type(code);
        cy.get(sel.form.price).type('40');
        cy.get(sel.form.name).type(rand());
        cy.get(sel.form.slug).clear().type(rand());
        assertNotCreated();
      });
    });

    // [PE Robusto Fraco - classe invalida: formato/charset do Codigo] (C1)
    // FIX: preenche o slug explicitamente (nao depende do autopreenchimento
    // via JS a partir do nome), isolando a variavel sob teste (formato do
    // codigo) de qualquer efeito colateral relacionado ao slug.
    it('rejeita Codigo com caracteres invalidos', () => {
      cy.visit(routes.newSimple);
      cy.get(sel.form.code).type('cod igo invalido!');
      cy.get(sel.form.price).type('40');
      cy.get(sel.form.name).type(rand());
      cy.get(sel.form.slug).clear().type(rand());
      assertNotCreated();
    });
  });

  // ---------- PREÇO: Análise de Valor Limite + Robustez ----------
  describe('Preco - Analise de Valor Limite', () => {
    // [AVL Robustez - fronteira inferior INVALIDA: min-1 (< 0)] (C1)
    it('rejeita preco negativo', () => {
      cy.visit(routes.newSimple);
      cy.get(sel.form.code).type(rand());
      cy.get(sel.form.price).type('-1');
      cy.get(sel.form.name).type(rand());
      cy.get(sel.form.slug).clear().type(rand());
      assertNotCreated();
    });

    // [AVL - fronteira inferior VALIDA: min (= 0)] (C1)
    it('aceita preco igual a 0 (limite valido)', () => {
      const code = rand();
      cy.visit(routes.newSimple);
      cy.get(sel.form.code).type(code);
      cy.get(sel.form.price).type('0');
      cy.get(sel.form.name).type(rand());
      cy.get(sel.form.slug).clear().type(code);
      cy.get(sel.form.submit).click();
      cy.get(sel.flash).should('contain', 'successfully created');
    });
  });

  // ---------- EDIÇÃO ----------
  describe('Edicao de produto', () => {
    it('edita o nome de um produto existente e persiste', () => {
      seedSimpleProduct().then((code) => {
        const novoNome = rand();
        cy.visit(routes.list);
        cy.get(sel.filter.search).type(code);
        cy.get(sel.filter.apply).click();
        cy.get(`${sel.grid.rows} a[href*="/edit"]`).first().click();

        cy.get(sel.form.name).clear().type(novoNome);
        cy.get(sel.form.saveChanges).click();

        cy.get(sel.flash).should('contain', 'successfully updated');
        cy.get(sel.form.name).should('have.value', novoNome);
      });
    });
  });

  // ---------- LISTAGEM / FILTRO (PE: ha / nao ha correspondencia) ----------
  describe('Listagem e filtro', () => {
    it('filtra por codigo e retorna o produto correspondente', () => {
      seedSimpleProduct().then((code) => {
        cy.visit(routes.list);
        cy.get(sel.filter.search).clear().type(code);
        cy.get(sel.filter.apply).click();
        cy.get(sel.grid.rows).should('contain.text', code);
      });
    });

    it('filtra por termo inexistente e exibe estado vazio', () => {
      cy.visit(routes.list);
      cy.get(sel.filter.search).clear().type(`INEXISTENTE_${rand()}`);
      cy.get(sel.filter.apply).click();
      cy.get('body').should('contain', sel.noResultsText);
    });
  });

  // ---------- EXCLUSÃO ----------
  describe('Exclusao de produto', () => {
    it('exclui um produto via bulk action e ele some da listagem', () => {
      seedSimpleProduct().then((code) => {
        cy.visit(routes.list);
        cy.get(sel.filter.search).clear().type(code);
        cy.get(sel.filter.apply).click();

        cy.get('td').contains(code).click();
        cy.get('.bulk-select-checkbox').first().click();
        cy.get('form:nth-child(1) > .red').click();
        cy.get('#confirmation-button').click();

        cy.get(sel.flash).should('contain', 'successfully deleted');
        cy.get(sel.filter.search).clear().type(code);
        cy.get(sel.filter.apply).click();
        cy.get('body').should('contain', sel.noResultsText);
      });
    });
  });
});
