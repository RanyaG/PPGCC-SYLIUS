const { it } = require("mocha");

describe('payment methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('change cash on delivery position', async () => {
    // Click in payment methods in side menu
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Type in value input to search for specify payment method
    cy.get('[id="criteria_search_value"]').type('cash');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last payment method
    cy.get('*[class^="ui labeled icon button"]').last().click();
    // Type 1 in position field
    cy.get('[id="sylius_payment_method_position"]').type('1');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that payment method has been updated
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });

  it('change enable state of Bank Transfer', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');

    cy.get('[id="criteria_search_value"]').type('bank_transfer');

    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button"]').last().click();
    
    cy.get('[id="sylius_payment_method_enabled"]').last().click({force:true})
    cy.get('#sylius_save_changes_button').scrollIntoView().click(); 
  
    cy.contains('Payment method has been successfully updated.').should('exist');
  });
  
  it('create offline credit card payment method', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    
    cy.get('[id="offline"]').click()

    cy.get('[id="sylius_payment_method_code"]').type('credit_card')
    cy.get('[id="sylius_payment_method_position"]').type('2')
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('Credit Card')

    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    cy.get('body').should('contain', 'Payment method has been successfully created.');
  });

  it('delete last credit card payment method', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');

    cy.get('[id="criteria_search_value"]').type('credit_card');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    
    cy.get('*[class^="ui red labeled icon button"]').last().click();
    cy.get('[id="confirmation-button"]').click();
    cy.get('body').should('contain', 'Payment method has been successfully deleted.');
  });

  it('edit and verify bank transfer name change', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');

    cy.get('[id="criteria_search_value"]').type('bank_transfer');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').click();

    cy.get('[id="sylius_payment_method_translations_en_US_name"]').clear().type("New Bank Transfer");
    cy.get('[id="sylius_save_changes_button"]').click();

    cy.contains('Payment method has been successfully updated.').should('exist');
    cy.contains('Payment methods').click();
    cy.contains('New Bank Transfer').should('exist');  
  });

  it('create international bank transfer and verify', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    
    cy.get('[id="offline"]').click()

    cy.get('[id="sylius_payment_method_code"]').type('int_bank_transfer');
    cy.get('[id="sylius_payment_method_position"]').type('3');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('International Bank Transfer');

    cy.get('*[class^="ui labeled icon primary button"]').last().click();
    cy.contains('Payment method has been successfully created.').should('exist');

    cy.contains('Payment methods').click();
    cy.contains('bank_transfer').should('exist');  
    cy.contains('int_bank_transfer').should('exist');  
  });

  it('create and verify stripe checkout credit card', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();

    cy.get('[id="stripe_checkout"]').click();

    cy.get('[id="sylius_payment_method_code"]').type('credit_card');
    cy.get('[id="sylius_payment_method_position"]').type('4');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('Credit Card');
    cy.get('[id="sylius_payment_method_translations_en_US_description"]').type('Mastercard');

    cy.get('[id="sylius_payment_method_channels_0"]').click({force:true});

    cy.get('[id="sylius_payment_method_gatewayConfig_config_publishable_key"]').type('12345');
    cy.get('[id="sylius_payment_method_gatewayConfig_config_secret_key"]').type('54321');

    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    cy.contains('Payment method has been successfully created.').should('exist');

    cy.contains('Payment methods').click();
    cy.contains('credit_card').should('exist');  
  });

  it('create and verify paypal express checkout', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();

    cy.get('[id="paypal_express_checkout"]').click();

    cy.get('[id="sylius_payment_method_code"]').type('pay_pal_checkout');
    cy.get('[id="sylius_payment_method_position"]').type('5');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('PayPal Checkout');

    cy.get('[id="sylius_payment_method_gatewayConfig_config_username"]').type('testusername');
    cy.get('[id="sylius_payment_method_gatewayConfig_config_password"]').type('testpassword');
    cy.get('[id="sylius_payment_method_gatewayConfig_config_signature"]').type('testsignature');

    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    cy.contains('Payment method has been successfully created.').should('exist');

    cy.contains('Payment methods').click();
    cy.contains('pay_pal_checkout').should('exist');  
  });

  it('create german international bank card', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();

    cy.get('[id="offline"]').click();

    cy.get('[id="sylius_payment_method_code"]').type('int_credit_card');
    cy.get('[id="sylius_payment_method_position"]').type('6');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('International Credit Card');

    cy.get('*[class^="de flag"]').last().click();
    cy.get('[id="sylius_payment_method_translations_de_DE_name"]').type('(German) International Credit Card');
    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    cy.contains('Payment method has been successfully created.').should('exist');
  });

  it('assert card presence and absence', async () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('[id="criteria_search_value"]').type('card');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    const stringsIn = ['credit_card', 'int_credit_card'];
    const stringsOut = ['bank_transfer', 'cash_on_delivery', 'int_bank_transfer', 'pay_pal_checkout'];
  
    cy.get('body').invoke('text').then((bodyText) => {
      const stringsInBool = stringsIn.every(str => bodyText.includes(str));
      const stringsOutBool = stringsOut.every(str => bodyText.includes(str));
  
      expect(stringsInBool).to.be.true;
      expect(stringsOutBool).to.be.false;
    });
  });
});