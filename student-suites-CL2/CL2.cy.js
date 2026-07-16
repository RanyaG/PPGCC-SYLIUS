import './commands';

describe('Customers', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.navigateToCustomersList();
  });

  it('updates a customer phone number', () => {
    cy.searchCustomers('contains', '@gmail');
    cy.clickEditButton();
    cy.get('[id="sylius_customer_phoneNumber"]').scrollIntoView().clear().type('999.999.9999');
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
    cy.verifyText('body', 'Customer has been successfully updated.');
  });

  it('created a new customer and pops-up successful creation', () => {
    cy.createNewCustomer('test', 'user', 'test@example.com', '999999999');
    cy.verifyText('body', 'Customer has been successfully created.');
  });

  it('lists customer emails that end with @gmail', () => {
    cy.searchCustomers('contains', '@gmail');
    cy.verifyText('body', 'test@example.com');
  });

  it('shows an error when creating a customer with just the name filled', () => {
    cy.createNewCustomerWithError('test');
  });

  it('shows a confirmation when the customer is impersonated', () => {
    cy.impersonateCustomerAndVerifyConfirmation('*@yahoo.com');
  });

  describe('Cancel Button', () => {
    it('navigates back to the customers list', () => {
      cy.navigateToNewCustomerForm();
      cy.cancelCreationAndVerifyNavigation();
    });
  });

  describe('Newsletter Subscription', () => {
    it('can check the newsletter subscription checkbox', () => {
      cy.navigateToNewCustomerForm();
      cy.checkNewsletterSubscriptionCheckbox();
    });
  });

  it('displays correct customer details by clicking the Show button for test user', () => {
    cy.searchCustomers('contains', 'test@example.com');
    cy.clickShowButton();
    cy.verifyCustomerDetails('test user', 'test@example.com', '999999999');
  });

  it('searches a customer by their last name', () => {
    cy.searchCustomers('ends_with', 'user');
    cy.verifyCustomerNames('test', 'user');
  });

  it('displays deletion confirmation question', () => {
    cy.searchCustomers('contains', '*yahoo.com');
    cy.clickShowButton();
    cy.deleteCustomerAndVerifyConfirmation();
  });

  // ESSE AQ
  it('checks if orders are correctly listed', () => {
    cy.searchCustomers('contains', 'test@example.com');
    cy.viewCustomerOrders();
    cy.filterOrdersByTotal('80', '400');
    cy.verifyOrder('#000000009');
  });
});
