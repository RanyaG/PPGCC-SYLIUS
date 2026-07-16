describe('customers', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  function filterCostumer(att) {
    // Clicar em costumers no Menu
    cy.clickInFirst('a[href="/admin/customers/"]');

    // Escrever no campo de busca
    cy.get('[id="criteria_search_value"]').type(att);

    // Clicar no botão de filtro
    cy.get('*[class^="ui blue labeled icon button"]').click();
  }

  function admCreateCustomer(name, lastName, email, group, gender, phone, createPassword, password) {

    cy.clickInFirst('a[href="/admin/customers/"]');
    cy.get('*[class^="ui right floated buttons"]').click();
    cy.get('*[id="sylius_customer_firstName"]').type(name);
    cy.get('*[id="sylius_customer_lastName"]').type(lastName);
    if (email != '' ) {
      cy.get('*[id="sylius_customer_email"]').type(email);
    }
    cy.get('*[id="sylius_customer_group"]').select(group); //'Retail'  
    cy.get('*[id="sylius_customer_gender"]').select(gender);
    cy.get('*[id="sylius_customer_phoneNumber"]').type(phone);

    if (createPassword) {
      cy.get('*[id="sylius_customer_createUser"]').check({
        force: true
      });
      cy.get('*[class^="ui borderless menu"]').get('*[id="sylius_customer_user_plainPassword"]').type(password);
      cy.get('*[id="sylius_customer_user_plainPassword"]').type(password);
      cy.get('*[id="sylius_customer_user_enabled"]').check({
        force: true
      });
    }

    cy.get('*[class^="ui labeled icon primary button"]').click();
  }

  function costumerRegisterThemself(name, lastName, email, phone, password) {

    cy.visit('/en_US');
    cy.get('*[class^="ui right stackable inverted menu"]').contains('Register').click();

    cy.get('*[id="sylius_customer_registration_firstName"]').type(name);
    cy.get('*[id="sylius_customer_registration_lastName"]').type(lastName);
    cy.get('*[id="sylius_customer_registration_email"]').type(email);
    cy.get('*[id="sylius_customer_registration_phoneNumber"]').type(phone);

    cy.get('*[id="sylius_customer_registration_user_plainPassword_first"]').type(password);
    cy.get('*[id="sylius_customer_registration_user_plainPassword_second"]').type(password);

    cy.get('*[class^="ui large primary button"]').click();
  }

  function customerLogin(email, password) {
    cy.visit('/en_US');
    cy.get('*[class^="ui right stackable inverted menu"]').contains('Login').click();
    cy.get('*[id="_username"]').type(email);
    cy.get('*[id="_password"]').type(password);
    cy.get('*[class^="ui blue submit button"]').click();
  }

  it('t1: Atualizar telefone do cliente: atualização sucedida', () => {

    filterCostumer('@gmail');

    // Clicar em editar o último customer da lista
    cy.get('*[class^="ui labeled icon button "]').last().click();

    // Editar o telefone do customer
    cy.get('[id="sylius_customer_phoneNumber"]').scrollIntoView().clear().type('999.999.9999');

    // Salvar mudança
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert: o customer foi atualizado corretamente
    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('t2: Atualizar email do cliente com email de outro cliente: erro, não pode ter informação repetida', () => {

    admCreateCustomer('Test', 'UserA', 'user01@example.com', 'Retail', 'Female', '123456789', true, 'senha123');

    filterCostumer('@gmail');

    cy.get('*[class^="ui labeled icon button "]').last().click();

    cy.get('[id="sylius_customer_email"]').scrollIntoView().clear().type('user01@example.com');

    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('t3: Filtrar cliente com valor válido', () => {

    admCreateCustomer('Test', 'UserB', 'user02@example.com', 'Retail', 'Female', '123456789', false, null);
    filterCostumer('Test UserB');

    // Assert: o filtro retorna o customer buscado
    cy.get('body').should('contain', 'Test');
    cy.get('body').should('contain', 'UserB');
  });

  it('t4: Filtrar cliente com valor inválido', () => {

    filterCostumer('Nonexistent');

    // Assert: nenhum resultado encontrado
    cy.get('body').should('contain', 'There are no results to display');

  });


  it('t5: Adm cadastra um cliente válido', () => {

    admCreateCustomer('Test', 'UserC', 'user03@example.com', 'Retail', 'Male', '987654321', true, 'senha123');
    cy.get('body').should('contain', 'Customer has been successfully created.');

  });

  it('t6: Adm cadastra um cliente inválido: email já cadastrado', () => {

    admCreateCustomer('Test', 'UserD', 'user04@example.com', 'Retail', 'Female', '987654321', true, 'senha123');
    cy.get('body').should('contain', 'Customer has been successfully created.');

    admCreateCustomer('Test', 'UserD', 'user04@example.com', 'Retail', 'Female', '987654322', true, 'senha123');
    cy.get('body').should('contain', 'This email is already used');

  });

  it('t7: Costumer se cadastra no site, e adm verifica se esta na sua lista de customers', () => {

    costumerRegisterThemself('Test', 'UserE', 'user05@example.com', '987654321', 'senha123');

    cy.get('body').should('contain', 'Thank you for registering, check your email to verify your account');

    cy.visit('/admin');
    cy.clickInFirst('a[href="/admin/customers/"]');

    cy.get('body').should('contain', 'Test');
    cy.get('body').should('contain', 'UserE');
    cy.get('body').should('contain', 'user05@example.com');

  });

  it('t8: Costumer se registra e recebe erro porque a conta não está ativada pelo adm', () => {

    costumerRegisterThemself('Test', 'UserF', 'user06@example.com', '123456789', 'senha123');
    cy.get('body').should('contain', 'Thank you for registering, check your email to verify your account');

    customerLogin('user06@example.com', 'senha123');
    cy.get('body').should('contain', 'Invalid credentials.');

  });

  it('t9: Verificar se cliente não tem compras', () => {

    filterCostumer('user06@example.com');
    cy.get('*[class^="ui labeled icon button"]').eq(2).click();
    cy.get('body').should('contain', 'There are no results to display');

  });


  it('t10: Adm cadastra cliente sem email: erro', () => {

    admCreateCustomer('Test', 'UserG', '', 'Retail', 'Male', '123456789', true, 'senha123');
    cy.get('body').should('contain', 'Please enter your email');

  });

});
