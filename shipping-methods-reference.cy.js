/// <reference types="cypress" />
const crypto = require('crypto');

const ADMIN = { user: 'sylius', pass: 'sylius' };

function rand() {
  return crypto.randomBytes(20).toString('hex').substring(0, 8);
}

const routes = {
  list: '/admin/shipping-methods/',
  new: '/admin/shipping-methods/new',
};

const sel = {
  form: {
    code: '#sylius_shipping_method_code',
    name: '#sylius_shipping_method_translations_en_US_name',
    zone: '#sylius_shipping_method_zone',
    // calculador de custo (select) e o valor por canal (FASHION_WEB)
    calculator: '#sylius_shipping_method_calculator',
    amount: '#sylius_shipping_method_configuration_FASHION_WEB_amount',
    submit: '.primary',
    saveChanges: '#sylius_save_changes_button',
  },
  flash: '.sylius-flash-message',
  filter: {
    search: '#criteria_search_value',
    apply: '.ui.blue.labeled.icon.button',
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

/**
 * Cria um metodo de envio valido e retorna o code.
 * Preenche code, name, zona, calculador (Flat rate) e valor.
 * Setup independente para os blocos de edicao/filtro/exclusao.
 */
function seedShippingMethod() {
  const code = rand();
  cy.visit(routes.new);
  cy.get(sel.form.code).type(code);
  cy.get(sel.form.name).type(`Envio ${code}`);
  cy.get(sel.form.zone).select('US');
  cy.get(sel.form.amount).clear().type('10');
  cy.get(sel.form.submit).click();
  cy.get(sel.flash).should('contain', 'successfully created');
  return cy.wrap(code);
}

/**
 * Submete o form de criacao e verifica que o metodo NAO foi criado.
 * Robusto a instabilidade de sessao: confirma ausencia da flash de sucesso.
 *
 * IMPORTANTE: tambem falha se a pagina virar um erro 500/crash do servidor.
 * Um crash NAO e uma rejeicao valida de validacao - e um bug diferente.
 * Sem essa checagem extra, um defeito que remove a validacao mas quebra
 * o fluxo em outro ponto (ex: constraint de banco ou evento interno)
 * faria esse teste "passar" por acidente, mascarando o problema real.
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
describe('Referencia - Shipping Methods (Admin, Sylius 1.x)', () => {
  beforeEach(() => {
    ensureLoggedIn();
  });

  // ---------- CRIAÇÃO (Partição por Equivalência - Robusto Fraco) ----------
  // NOTA DE COBERTURA: o metodo de envio exige Code, Name, Zona e um
  // Calculador com valor. Code e Name sao identificadores textuais; Zona e
  // Calculador sao campos enumerados (select). O valor (amount) e numerico
  // e configurado por canal (FASHION_WEB).
  describe('Criacao de metodo de envio', () => {
    // [PE Robusto Fraco - caso totalmente valido] (C1)
    it('cria um metodo de envio com campos validos', () => {
      const code = rand();
      cy.visit(routes.new);
      cy.get(sel.form.code).type(code);
      cy.get(sel.form.name).type(`Envio ${code}`);
      cy.get(sel.form.zone).select('US');
      cy.get(sel.form.amount).clear().type('10');
      cy.get(sel.form.submit).click();

      cy.get(sel.flash).should('contain', 'successfully created');
      cy.visit(routes.list);
      cy.get(sel.filter.search).type(code);
      cy.get(sel.filter.apply).click();
      cy.get(sel.grid.rows).should('contain.text', code);
    });

    // [PE Robusto Fraco - classe invalida isolada: Code obrigatorio] (C1)
    it('rejeita criacao com Codigo vazio', () => {
      cy.visit(routes.new);
      cy.get(sel.form.name).type(`Envio ${rand()}`);
      cy.get(sel.form.zone).select('US');
      cy.get(sel.form.amount).clear().type('10');
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida isolada: Name obrigatorio] (C1)
    it('rejeita criacao com Nome vazio', () => {
      cy.visit(routes.new);
      cy.get(sel.form.code).type(rand());
      cy.get(sel.form.zone).select('US');
      cy.get(sel.form.amount).clear().type('10');
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida: unicidade do Codigo] (C1)
    it('rejeita Codigo duplicado', () => {
      seedShippingMethod().then((code) => {
        cy.visit(routes.new);
        cy.get(sel.form.code).type(code);
        cy.get(sel.form.name).type(`Envio dup ${rand()}`);
        cy.get(sel.form.zone).select('US');
        cy.get(sel.form.amount).clear().type('10');
        assertNotCreated();
      });
    });

    // [PE Robusto Fraco - classe invalida: Zona obrigatoria ausente] (C1)
    // Caracteristica propria desta secao: o metodo exige uma zona de entrega.
    it('rejeita criacao sem Zona selecionada', () => {
      cy.visit(routes.new);
      cy.get(sel.form.code).type(rand());
      cy.get(sel.form.name).type(`Envio ${rand()}`);
      cy.get(sel.form.amount).clear().type('10');
      assertNotCreated();
    });
  });

  // ---------- VALOR (amount): Análise de Valor Limite ----------
  // NOTA: a especificacao define a fronteira inferior do custo (>= 0).
  describe('Valor do envio - Analise de Valor Limite', () => {
    // [AVL - fronteira inferior VALIDA: amount = 0] (C1)
    it('aceita valor de envio igual a 0 (limite valido)', () => {
      const code = rand();
      cy.visit(routes.new);
      cy.get(sel.form.code).type(code);
      cy.get(sel.form.name).type(`Envio ${code}`);
      cy.get(sel.form.zone).select('US');
      cy.get(sel.form.amount).clear().type('0');
      cy.get(sel.form.submit).click();

      cy.get(sel.flash).should('contain', 'successfully created');
    });

    // [AVL Robustez - fronteira inferior INVALIDA: min-1 (< 0)] (C1)
    // Analogo ao teste de preco negativo de Produtos: valor de envio
    // negativo nao tem significado de negocio e deve ser rejeitado.
    it('rejeita valor de envio negativo', () => {
      cy.visit(routes.new);
      cy.get(sel.form.code).type(rand());
      cy.get(sel.form.name).type(`Envio ${rand()}`);
      cy.get(sel.form.zone).select('US');
      cy.get(sel.form.amount).clear().type('-5');
      assertNotCreated();
    });
  });

  // ---------- EDIÇÃO ----------
  describe('Edicao de metodo de envio', () => {
    // [HP de operacao distinta] (C1)
    it('edita o nome de um metodo de envio e persiste', () => {
      seedShippingMethod().then((code) => {
        const novoNome = `Envio EDIT ${code}`;
        cy.visit(routes.list);
        cy.get(sel.filter.search).type(code);
        cy.get(sel.filter.apply).click();
        cy.get(`${sel.grid.rows} a[href*="/edit"]`).first().click();

        cy.get(sel.form.name).clear().type(novoNome);
        cy.get(sel.form.saveChanges).scrollIntoView().click();

        cy.get(sel.flash).should('contain', 'successfully updated');
        cy.get(sel.form.name).should('have.value', novoNome);
      });
    });
  });

  // ---------- LISTAGEM / FILTRO (PE: ha / nao ha correspondencia) ----------
  describe('Listagem e filtro', () => {
    // [PE - classe "ha correspondencia"] (C1)
    it('filtra por codigo e retorna o metodo correspondente', () => {
      seedShippingMethod().then((code) => {
        cy.visit(routes.list);
        cy.get(sel.filter.search).clear().type(code);
        cy.get(sel.filter.apply).click();
        cy.get(sel.grid.rows).should('contain.text', code);
      });
    });

    // [PE - classe "sem correspondencia" / fronteira de resultado vazio] (C1)
    it('filtra por termo inexistente e exibe estado vazio', () => {
      cy.visit(routes.list);
      cy.get(sel.filter.search).clear().type(`INEXISTENTE_${rand()}`);
      cy.get(sel.filter.apply).click();
      cy.get('body').should('contain', sel.noResultsText);
    });
  });

  // ---------- EXCLUSÃO ----------
  describe('Exclusao de metodo de envio', () => {
    // [CA - remocao + confirmacao] (C1)
    // O metodo de envio usa botao Delete direto (form com _method=DELETE)
    // e modal de confirmacao do Sylius com botao verde "ok".
    it('exclui um metodo de envio e ele some da listagem', () => {
      seedShippingMethod().then((code) => {
        cy.visit(routes.list);
        cy.get(sel.filter.search).clear().type(code);
        cy.get(sel.filter.apply).click();

        // botao Delete (input hidden _method=DELETE dentro do form da linha)
        cy.get('input[value="DELETE"]').parents('form').find('button').first()
          .scrollIntoView().click();
        // confirmacao do modal (botao verde "ok")
        cy.get('.ui.green.ok.inverted.button').click();

        cy.get(sel.flash).should('contain', 'successfully deleted');
        cy.get(sel.filter.search).clear().type(code);
        cy.get(sel.filter.apply).click();
        cy.get('body').should('contain', sel.noResultsText);
      });
    });
  });
});
