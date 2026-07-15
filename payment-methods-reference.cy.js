/// <reference types="cypress" />
const crypto = require('crypto');

const ADMIN = { user: 'sylius', pass: 'sylius' };

function rand() {
  return crypto.randomBytes(20).toString('hex').substring(0, 8);
}

const routes = {
  list: '/admin/payment-methods/',
  // criacao de metodo offline (gateway mais simples, sem credenciais externas)
  newOffline: '/admin/payment-methods/new/offline',
};

const sel = {
  form: {
    code: '#sylius_payment_method_code',
    name: '#sylius_payment_method_translations_en_US_name',
    position: '#sylius_payment_method_position',
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
  // texto exato exibido pelo Sylius numa caixa "Info" (nao em <td>)
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

function seedPaymentMethod() {
  const code = rand();
  cy.visit(routes.newOffline);
  cy.get(sel.form.code).type(code);
  cy.get(sel.form.name).type(rand());
  cy.get(sel.form.submit).click();
  cy.get(sel.flash).should('contain', 'successfully created');
  return cy.wrap(code);
}

/**
 * Submete o formulario de criacao e verifica que o metodo NAO foi criado.
 * Robusto a instabilidade de sessao: nao checa URL (que poderia virar /login),
 * apenas confirma que NAO apareceu a flash de sucesso de criacao.
 *
 * IMPORTANTE: tambem falha se a pagina virar um erro 500/crash do servidor.
 * Um crash NAO e uma rejeicao valida de validacao - e um bug diferente.
 * Sem essa checagem extra, um defeito que remove a validacao mas quebra
 * o fluxo em outro ponto (ex: constraint de banco em cascata, como vimos
 * em sylius_gateway_config e sylius_payment_method) faria esse teste
 * "passar" por acidente, mascarando o problema real.
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
describe('Referencia - Payment Methods (Admin, Sylius 1.x)', () => {
  beforeEach(() => {
    ensureLoggedIn();
  });

  // ---------- CRIAÇÃO (Partição por Equivalência - Robusto Fraco) ----------
  // NOTA DE COBERTURA: o metodo Offline exige Code e Name (obrigatorios).
  // Channels NAO e obrigatorio na pratica (confirmado em exploracao: criou
  // sem marcar canal), por isso nao integra as classes invalidas testadas.
  describe('Criacao de metodo de pagamento', () => {
    // [PE Robusto Fraco - caso totalmente valido] (C1)
    // Representante das classes VALIDAS (analogo a CT01 de Valida Senha).
    it('cria um metodo de pagamento offline com campos validos', () => {
      const code = rand();
      cy.visit(routes.newOffline);
      cy.get(sel.form.code).type(code);
      cy.get(sel.form.name).type(rand());
      cy.get(sel.form.submit).click();

      cy.get(sel.flash).should('contain', 'successfully created');
      cy.visit(routes.list);
      cy.get(sel.filter.search).type(code);
      cy.get(sel.filter.apply).click();
      cy.get(sel.grid.rows).should('contain.text', code);
    });

    // [PE Robusto Fraco - classe invalida isolada: Codigo obrigatorio] (C1)
    // Um valor invalido (codigo vazio) + demais validos.
    it('rejeita criacao com Codigo vazio', () => {
      cy.visit(routes.newOffline);
      cy.get(sel.form.name).type(rand());
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida isolada: Nome obrigatorio] (C1)
    // Nao redundante: isola outra condicao de entrada.
    it('rejeita criacao com Nome vazio', () => {
      cy.visit(routes.newOffline);
      cy.get(sel.form.code).type(rand());
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida: unicidade do Codigo] (C1)
    // Analogo a CT06 (senha de dicionario): valor bem-formado mas que
    // viola uma regra de negocio. Caminho alternativo.
    it('rejeita Codigo duplicado', () => {
      seedPaymentMethod().then((code) => {
        cy.visit(routes.newOffline);
        cy.get(sel.form.code).type(code);
        cy.get(sel.form.name).type(rand());
        assertNotCreated();
      });
    });

    // [PE Robusto Fraco - classe invalida: formato/charset do Codigo] (C1)
    // Charset nao tem relacao de ordem (slide 05 - "Quando NAO usar AVL");
    // por isso e PE, nao AVL. Analogo a CT04/CT05 de Valida Senha
    // (1o caractere invalido / caractere de controle).
    it('rejeita Codigo com caracteres invalidos', () => {
      cy.visit(routes.newOffline);
      cy.get(sel.form.code).type('cod igo invalido!');
      cy.get(sel.form.name).type(rand());
      assertNotCreated();
    });
  });

  // ---------- EDIÇÃO ----------
  describe('Edicao de metodo de pagamento', () => {
    // [HP de operacao distinta - nao redunda com criacao] (C1)
    it('edita o nome de um metodo existente e persiste', () => {
      seedPaymentMethod().then((code) => {
        const novoNome = rand();
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

    // [PE - atualizacao de campo de ordenacao: position] (C1)
    // Baseado no caso de exemplo do starter kit (campo position).
    // Operacao distinta da edicao de nome => nao redundante.
    it('atualiza a posicao do metodo de pagamento', () => {
      seedPaymentMethod().then((code) => {
        cy.visit(routes.list);
        cy.get(sel.filter.search).type(code);
        cy.get(sel.filter.apply).click();
        cy.get(`${sel.grid.rows} a[href*="/edit"]`).first().click();

        cy.get(sel.form.position).clear().type('1');
        cy.get(sel.form.saveChanges).scrollIntoView().click();

        cy.get(sel.flash).should('contain', 'successfully updated');
      });
    });
  });

  // ---------- LISTAGEM / FILTRO (PE: ha / nao ha correspondencia) ----------
  describe('Listagem e filtro', () => {
    // [PE - classe "ha correspondencia"] (C1)
    it('filtra por codigo e retorna o metodo correspondente', () => {
      seedPaymentMethod().then((code) => {
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
      // texto aparece numa caixa "Info", nao em <td> => busca no body
      cy.get('body').should('contain', sel.noResultsText);
    });
  });

  // ---------- EXCLUSÃO ----------
  describe('Exclusao de metodo de pagamento', () => {
    // [CA - remocao em massa + confirmacao] (C1)
    it('exclui um metodo de pagamento e ele some da listagem', () => {
      seedPaymentMethod().then((code) => {
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
