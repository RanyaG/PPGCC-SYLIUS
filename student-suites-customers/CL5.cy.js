describe('user register', () => {
  beforeEach(() => {
    cy.visit('/en_US/register');
    cy.wait(500);
  });

  it('1- Register user', () => {
    cy.wait(1000);
    cy.get('[id="sylius_customer_registration_firstName"]').type('syliusUser');
    cy.get('[id="sylius_customer_registration_lastName"]').type('Teste');
    cy.get('[id="sylius_customer_registration_email"]').type('syliusUser@gmail.com');
    cy.get('[id="sylius_customer_registration_user_plainPassword_first"]').type('syliusUser');
    cy.get('[id="sylius_customer_registration_user_plainPassword_second"]').type('syliusUser');
    cy.get('.primary').click();
    cy.wait(1000);
    cy.url().should('include', '/register/thank-you?id=');
  });
});

describe('customers', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.clickInFirst('a[href="/admin/customers/"]');
  });

  // Justificativa: Se fez necessario gerar nomes de email aleatorios
  // pois o sylius sempre mantem registro de guests para controle
  // e para que o teste de criar customer funcione deve ser
  // utilizado um email que não esteja em uso.
  function genEmail() {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${randomStr}`;
  }

  it('1- Check if the customer table is included correctly', () => {
    cy.get('table.ui.sortable', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('tbody tr')
          .first()
          .within(() => {
            cy.get('td').eq(0).should('not.be.empty');
            cy.get('td').eq(1).should('not.be.empty');
            cy.get('td').eq(2).should('contain', '@');
          });
      });
  });

  it('2- Grant credentials to newly created account', () => {
    cy.wait(2000);
    cy.get('[id="criteria_search_value"]', { timeout: 10000 }).should('be.visible').type('syliusUser@gmail.com');
    cy.get('*[class^="ui blue labeled icon button"]').should('be.visible').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.wait(2000);
    cy.findAllByText(/^Enabled/i).should('be.visible').click();
    cy.findAllByText(/^Verified/i).should('be.visible').click();
    cy.findAllByText(/^Save changes/i).first().should('be.visible').click();
    cy.wait(2000);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('3- Update a customer phone number', () => {
    cy.wait(1000);
    cy.get('[id="criteria_search_value"]', { timeout: 10000 }).type('@gmail');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_customer_phoneNumber"]').scrollIntoView().clear().type('999.999.9999');
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    cy.wait(1000);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('4- Create new customer', () => {
    cy.findAllByText(/^Create/i)
      .first()
      .should('be.visible')
      .click();
    cy.get('#sylius_customer_firstName').should('be.visible').type('Test');
    cy.get('#sylius_customer_lastName').should('be.visible').type('User');
    cy.get('#sylius_customer_email').should('be.visible').type(`${genEmail()}@gmail.com`);
    cy.get('#sylius_customer_group').should('be.visible').select('Retail');
    cy.get('#sylius_customer_gender').should('be.visible').select('Male');
    cy.get('#sylius_customer_birthday').should('be.visible').type('1987-12-12');
    cy.get('#sylius_customer_phoneNumber').should('be.visible').type('99999999');

    cy.findAllByText(/^Create/i)
      .first()
      .should('be.visible')
      .click();

    cy.get('body').should('contain', 'Customer has been successfully created.');
  });

  it('5- Search for a user', () => {
    cy.wait(1000);
    cy.get('#criteria_search_type').select('equal');
    cy.get('#criteria_search_value').type('Test');
    cy.get('.sylius-autocomplete').type('Retail{enter}');
    cy.findAllByText(/^Filter/i)
      .first()
      .click();
    cy.wait(1000);
    cy.findAllByText(/^Test/i).should('be.visible');
    cy.findAllByText(/^User/i).should('be.visible');
  });

  it('6- Grant account credentials', () => {
    cy.wait(1000);
    cy.get('.segment').scrollTo('right');
    cy.findAllByText(/^Edit/i).first().click();
    cy.findAllByText(/^Customer can login to the store?/i).click();
    cy.get('#sylius_customer_user_plainPassword').type('pass123');
    cy.findAllByText(/^Enabled/i).click();
    cy.findAllByText(/^Verified/i).click();
    cy.findAllByText(/^Save changes/i)
      .first()
      .click();
    cy.wait(1000);
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('7- impersonated customer', () => {
    cy.get('.segment').should('be.visible').scrollTo('right');
    cy.findAllByText(/^Show/i).eq(2).should('be.visible').click();
    cy.findAllByText(/^Test User/i, { timeout: 10000 }).should('be.visible');
    cy.get('[id="impersonate"]').should('be.visible').click();
    cy.wait(1000);
    cy.get('body').should('contain', 'Successfully impersonated customer');
  });

  it('8- Show Orders', () => {
    cy.wait(1000);
    cy.get('.segment').scrollTo('right');
    cy.findAllByText(/^Show/i).eq(1).click();
    cy.wait(2000);
    cy.findAllByText(/^Test User/i).should('be.visible');
    cy.url().should('include', '/orders');
  });

  it('9- Delete custumer', () => {
    cy.wait(1000);
    cy.get('.segment').scrollTo('right');
    cy.findAllByText(/^Show/i).eq(2).click();
    cy.wait(1000);
    cy.findAllByText(/^Test User/i).should('be.visible');
    cy.findAllByText(/^Delete/i)
      .first()
      .click();
    cy.findAllByText(/^Yes/i).first().click();
    cy.wait(1000);
    cy.get('body').should('contain', 'Shop user has been successfully deleted.');
  });

  it('10- Filter Wholesale Customer groups', () => {
    cy.wait(2000);
    cy.get('.autocomplete').parent().click().wait(500);
    cy.get('*[class^="menu transition visible"]').should('be.visible');
    cy.get('.menu.transition.visible .item[data-value="wholesale"]').click();
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.wait(1000);
    cy.get('table.ui.sortable')
      .find('tbody tr')
      .first()
      .within(() => {
        cy.get('*[class^="ui labeled icon button "]').last().click();
        cy.timeout(2000);
      });
    cy.get('[id="sylius_customer_group"]', { timeout: 10000 }).and('have.value', 'wholesale');
  });
});

describe('user login', () => {
  beforeEach(() => {
    cy.wait(2000);
    cy.visit('/en_US/login');
  });

  it('1- Check available login', () => {
    cy.wait(1000);
    cy.get('[id="_username"]').type('syliusUser@gmail.com');
    cy.get('[id="_password"]').type('syliusUser');
    cy.get('*[class^="ui blue submit button"]').click();
    cy.wait(1000);
    cy.get('.ui.right.stackable.inverted.menu .item').should('contain.text', 'Hello');
  });
});
