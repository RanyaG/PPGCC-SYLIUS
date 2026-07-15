/// <reference types="cypress" />
const crypto = require('crypto');

const ADMIN = { user: 'sylius', pass: 'sylius' };

function rand() {
  return crypto.randomBytes(20).toString('hex').substring(0, 8);
}
function randEmail() {
  return `ref_${rand()}@example.com`;
}

const routes = {
  list: '/admin/customers/',
  new: '/admin/customers/new',
};

const sel = {
  form: {
    email: '#sylius_customer_email',
    firstName: '#sylius_customer_firstName',
    lastName: '#sylius_customer_lastName',
    phone: '#sylius_customer_phoneNumber',
    birthday: '#sylius_customer_birthday',
    gender: '#sylius_customer_gender',
    group: '#sylius_customer_group',
    // toggle "Customer can login to the store?" (acionado pelo label,
    // pois o checkbox real fica escondido atras do toggle do Semantic UI)
    createUserLabel: 'label[for="sylius_customer_createUser"]',
    password: '#sylius_customer_user_plainPassword',
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
  // botao Delete (vermelho) na pagina de detalhes do cliente
  deleteButton: '.ui.red.labeled.icon.button',
  // botao de confirmacao do modal do Sylius
  confirmDelete: '#confirmation-button',
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
 * Cria um cliente COM conta de acesso e retorna { email, showPath }.
 * A conta de acesso e necessaria para que o cliente possua o botao
 * Delete na pagina de detalhes (clientes sem conta nao o exibem).
 * showPath = pagina de detalhes (URL de criacao sem o sufixo '/edit').
 */
function seedCustomer() {
  const email = randEmail();
  cy.visit(routes.new);
  cy.get(sel.form.firstName).type(rand());
  cy.get(sel.form.lastName).type(rand());
  cy.get(sel.form.email).type(email);
  // habilita "Customer can login to the store?": o checkbox real fica
  // escondido atras do toggle do Semantic UI, entao acionamos pelo label.
  cy.get(sel.form.createUserLabel).click();
  cy.get(sel.form.password).type('senha12345');
  cy.get(sel.form.submit).click();
  cy.get(sel.flash).should('contain', 'successfully created');

  // apos criar, o Sylius fica em /admin/customers/{id}/edit.
  // a pagina de detalhes (onde fica o Delete) e a mesma URL sem '/edit'.
  return cy.location('pathname').then((editPath) => {
    const showPath = editPath.replace('/edit', '');
    return { email, showPath };
  });
}

/**
 * Submete o form de criacao e verifica que o cliente NAO foi criado.
 * Robusto a instabilidade de sessao: confirma ausencia da flash de sucesso.
 *
 * IMPORTANTE: tambem falha se a pagina virar um erro 500/crash do servidor.
 * Um crash NAO e uma rejeicao valida de validacao - e um bug diferente.
 * Sem essa checagem extra, um defeito que remove a validacao mas quebra
 * o fluxo em outro ponto (ex: constraint de banco em email/email_canonical)
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
describe('Referencia - Customers (Admin, Sylius 1.x)', () => {
  beforeEach(() => {
    ensureLoggedIn();
  });

  // ---------- CRIAÇÃO (Partição por Equivalência - Robusto Fraco) ----------
  // NOTA DE COBERTURA: o identificador do cliente e o EMAIL (nao um codigo).
  // Email tem formato (regra de bem-formacao) e unicidade (regra de negocio).
  // First/last name sao obrigatorios. Cliente "simples" (sem conta) nao exige
  // senha; a variante com conta exige plainPassword (fora deste escopo base).
  describe('Criacao de cliente', () => {
    // [PE Robusto Fraco - caso totalmente valido] (C1)
    // Representante das classes VALIDAS (analogo a CT01 de Valida Senha).
    it('cria um cliente com campos validos', () => {
      const email = randEmail();
      cy.visit(routes.new);
      cy.get(sel.form.firstName).type(rand());
      cy.get(sel.form.lastName).type(rand());
      cy.get(sel.form.email).type(email);
      cy.get(sel.form.submit).click();

      cy.get(sel.flash).should('contain', 'successfully created');
      cy.visit(routes.list);
      cy.get(sel.filter.search).type(email);
      cy.get(sel.filter.apply).click();
      cy.get(sel.grid.rows).should('contain.text', email);
    });

    // [PE Robusto Fraco - classe invalida isolada: Email obrigatorio] (C1)
    it('rejeita criacao com Email vazio', () => {
      cy.visit(routes.new);
      cy.get(sel.form.firstName).type(rand());
      cy.get(sel.form.lastName).type(rand());
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida: formato do Email mal-formado] (C1)
    // Email sem '@'/dominio viola a regra de BEM-FORMACAO do campo.
    // Analogo a CT04/CT05 de Valida Senha (entrada mal-formada).
    it('rejeita criacao com Email em formato invalido', () => {
      cy.visit(routes.new);
      cy.get(sel.form.firstName).type(rand());
      cy.get(sel.form.lastName).type(rand());
      cy.get(sel.form.email).type('email_invalido_sem_arroba');
      assertNotCreated();
    });

    // [PE Robusto Fraco - classe invalida: unicidade do Email] (C1)
    // Analogo a CT06 (senha de dicionario): valor bem-formado mas que
    // viola regra de negocio (email ja cadastrado). Caminho alternativo.
    it('rejeita Email duplicado', () => {
      seedCustomer().then(({ email }) => {
        cy.visit(routes.new);
        cy.get(sel.form.firstName).type(rand());
        cy.get(sel.form.lastName).type(rand());
        cy.get(sel.form.email).type(email);   // email ja existente
        assertNotCreated();
      });
    });
  });

  // ---------- EDIÇÃO ----------
  describe('Edicao de cliente', () => {
    // [HP de operacao distinta - nao redunda com criacao] (C1)
    it('edita o primeiro nome de um cliente e persiste', () => {
      seedCustomer().then(({ email }) => {
        const novoNome = rand();
        cy.visit(routes.list);
        cy.get(sel.filter.search).type(email);
        cy.get(sel.filter.apply).click();
        cy.get(`${sel.grid.rows} a[href*="/edit"]`).first().click();

        cy.get(sel.form.firstName).scrollIntoView().clear().type(novoNome);
        cy.get(sel.form.saveChanges).scrollIntoView().click();

        cy.get(sel.flash).should('contain', 'successfully updated');
        cy.get(sel.form.firstName).should('have.value', novoNome);
      });
    });

    // [PE - selecao de genero (campo enumerado)] (C1)
    // Operacao distinta (campo select) => nao redundante.
    it('altera o genero do cliente', () => {
      seedCustomer().then(({ email }) => {
        cy.visit(routes.list);
        cy.get(sel.filter.search).type(email);
        cy.get(sel.filter.apply).click();
        cy.get(`${sel.grid.rows} a[href*="/edit"]`).first().click();

        cy.get(sel.form.gender).scrollIntoView().select('Male');
        cy.get(sel.form.saveChanges).scrollIntoView().click();

        cy.get(sel.flash).should('contain', 'successfully updated');
      });
    });
  });

  // ---------- LISTAGEM / FILTRO (PE: ha / nao ha correspondencia) ----------
  describe('Listagem e filtro', () => {
    // [PE - classe "ha correspondencia"] (C1)
    it('filtra por email e retorna o cliente correspondente', () => {
      seedCustomer().then(({ email }) => {
        cy.visit(routes.list);
        cy.get(sel.filter.search).clear().type(email);
        cy.get(sel.filter.apply).click();
        cy.get(sel.grid.rows).should('contain.text', email);
      });
    });

    // [PE - classe "sem correspondencia" / fronteira de resultado vazio] (C1)
    it('filtra por termo inexistente e exibe estado vazio', () => {
      cy.visit(routes.list);
      cy.get(sel.filter.search).clear().type(`inexistente_${rand()}@nada.com`);
      cy.get(sel.filter.apply).click();
      cy.get('body').should('contain', sel.noResultsText);
    });
  });

  // ---------- EXCLUSÃO ----------
  describe('Exclusao de cliente', () => {
    // [CA - remocao + confirmacao] (C1)
    // Navega direto para a pagina de detalhes do cliente (/admin/customers/{id}),
    // onde fica o botao Delete (data-requires-confirmation => modal).
    it('exclui um cliente e exibe confirmacao de remocao', () => {
      seedCustomer().then(({ showPath }) => {
        cy.visit(showPath);

        cy.get(sel.deleteButton).scrollIntoView().click();
        cy.get(sel.confirmDelete).click();

        cy.get(sel.flash).should('contain', 'successfully deleted');
      });
    });
  });
});
