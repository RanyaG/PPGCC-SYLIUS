describe("tax rates", () => {
  beforeEach(() => {
    cy.visit("/admin");
    cy.get('[id="_username"]').type("sylius");
    cy.get('[id="_password"]').type("sylius");
    cy.get(".primary").click();
  });

  const createTaxRate = (taxRate) => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    cy.get(".ui.labeled.icon.button.primary").click();
    cy.get("#sylius_tax_rate_code").type(taxRate.code);
    cy.get("#sylius_tax_rate_name").type(taxRate.name);
    cy.get("#sylius_tax_rate_category").select(taxRate.category);
    cy.get("#sylius_tax_rate_zone").select(taxRate.zone);
    cy.get("#sylius_tax_rate_calculator").select(taxRate.calculator);
    cy.get("#sylius_tax_rate_amount").type(taxRate.amount);
    cy.get("#sylius_tax_rate_startDate_date").type(taxRate.startDate);
    cy.get("#sylius_tax_rate_startDate_time").type(taxRate.startTime);
    cy.get("#sylius_tax_rate_endDate_date").type(taxRate.endDate);
    cy.get("#sylius_tax_rate_endDate_time").type(taxRate.endTime);
    cy.get(".ui.labeled.icon.primary.button").click();
  };

  const deleteTaxRateByName = (taxRateName) => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    cy.get("#criteria_search_value").type(taxRateName);
    cy.get(".ui.blue.labeled.icon.button").click();
    cy.get("button.ui.red.labeled.icon.button").not("[disabled]").click();
    cy.get("#confirmation-button").click();
  };

  it("validate filter applied through cancel button", () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    // Type in value input to search for specify tax rate
    cy.get('[id="criteria_search_value"]').type("7");
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last tax rate
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Click on cancel button
    cy.get(
      ".admin-layout__content > .ui > .ui > .ui > .ui:nth-child(2)"
    ).click();

    // Assert that we are back to the listing page with the filter applied
    cy.get("body")
      .should("contain", "Sales Tax 7%")
      .and("not.contain", "Sales Tax 20%");
  });

  it("validate if tax rate can be created through create button with only necessary fields", () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Click in create button
    cy.get('*[class^="ui labeled icon button  primary"]').click();

    let taxRate = {
      code: "1212",
      name: "Everton Tax 19%",
      category: "clothing",
      zone: "US",
      calculator: "decimal",
      amount: "19",
      startDate: "2023-01-01",
      startTime: "09:00",
      endDate: "2023-12-31",
      endTime: "12:00",
    };

    createTaxRate(taxRate);

    // Assert that success message is shown
    cy.get('*[class^="ui icon positive message sylius-flash-message"]').should(
      "contain",
      "Success"
    );
  });

  it("validate if form fails if trying to create the same object", () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Click in create button
    cy.get('*[class^="ui labeled icon button  primary"]').click();

    let taxRate = {
      code: "1212",
      name: "Everton Tax 19%",
      category: "clothing",
      zone: "US",
      calculator: "decimal",
      amount: "19",
      startDate: "2023-01-01",
      startTime: "09:00",
      endDate: "2023-12-31",
      endTime: "12:00",
    };

    createTaxRate(taxRate);

    cy.get('*[class^="ui icon negative message"]').should("contain", "Error");
  });

  it("validate if cancel button works when creating", () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Click in create button
    cy.get('*[class^="ui labeled icon button  primary"]').click();

    let taxRate = {
      code: "0001",
      name: "FDA Tax 21%",
      category: "clothing",
      zone: "US",
      calculator: "decimal",
      amount: "21",
      startDate: "2021-01-01",
      startTime: "09:00",
      endDate: "2024-12-31",
      endTime: "12:00",
    };

    cy.get("#sylius_tax_rate_code").type(taxRate.code);
    cy.get("#sylius_tax_rate_name").type(taxRate.name);
    cy.get("#sylius_tax_rate_category").select(taxRate.category);
    cy.get("#sylius_tax_rate_zone").select(taxRate.zone);
    cy.get("#sylius_tax_rate_calculator").select(taxRate.calculator);
    cy.get("#sylius_tax_rate_amount").type(taxRate.amount);
    cy.get("#sylius_tax_rate_startDate_date").type(taxRate.startDate);
    cy.get("#sylius_tax_rate_startDate_time").type(taxRate.startTime);
    cy.get("#sylius_tax_rate_endDate_date").type(taxRate.endDate);
    cy.get("#sylius_tax_rate_endDate_time").type(taxRate.endTime);

    // Click in Cancel button
    cy.contains("button, a", "Cancel").click();

    cy.get('*[class^="content"]').should("contain", "Tax Rates");
  });

  it("validate if an existing tax rate can be edited", () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Click in create button
    cy.get('*[class^="ui labeled icon button  primary"]').click();

    let taxRate = {
      code: "202",
      name: "Make the L Tax 17%",
      category: "clothing",
      zone: "US",
      calculator: "decimal",
      amount: "17",
      startDate: "2021-01-01",
      startTime: "09:00",
      endDate: "2021-12-31",
      endTime: "12:00",
    };

    createTaxRate(taxRate);

    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Type in value input to search for specific tax rate
    cy.get('[id="criteria_search_value"]').type(taxRate.name);

    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Click in Edit button
    cy.contains("button, a", "Edit").click();

    // Change the tax rate name
    taxRate.name = "Make the B Tax 17%";
    cy.get('[id="sylius_tax_rate_name"]').clear().type(taxRate.name);

    // Click on save button
    cy.get('*[class^="ui labeled icon primary button"]').click();

    // Assert that success message is shown
    cy.get('*[class^="ui icon positive message sylius-flash-message"]').should(
      "contain",
      "Success"
    );

    cy.get("body").should("contain", "Make the B Tax 17%");

    deleteTaxRateByName(taxRate.name);
  });

  it("validate filter by date range", () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Click in create button
    cy.get('*[class^="ui labeled icon button  primary"]').click();

    let taxRate = {
      code: "202",
      name: "Jose Tax 9%",
      category: "clothing",
      zone: "US",
      calculator: "decimal",
      amount: "9",
      startDate: "2020-02-01",
      startTime: "09:00",
      endDate: "2020-12-31",
      endTime: "12:00",
    };

    createTaxRate(taxRate);

    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Set date range
    cy.get('[id="criteria_startDate_from_date"]').type(taxRate.startDate);
    cy.get('[id="criteria_startDate_to_date"]').type(taxRate.endDate);

    // Apply filter
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Assert filtered results are within the specified date range
    cy.get("body").should("contain", taxRate.name);

    deleteTaxRateByName(taxRate.name);
  });

  it("edit tax rate and verify changes", () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    cy.get('*[class^="ui labeled icon button  primary"]').click();

    let taxRate = {
      code: "204",
      name: "Tesf Tax 8%",
      category: "clothing",
      zone: "US",
      calculator: "decimal",
      amount: "9",
      startDate: "2020-02-01",
      startTime: "09:00",
      endDate: "2020-12-31",
      endTime: "12:00",
    };

    createTaxRate(taxRate);

    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    cy.get('[id="criteria_search_value"]').type("8");

    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Click Edit
    cy.contains("button, a", "Edit").click();

    // Update the tax rate name
    cy.get('[id="sylius_tax_rate_name"]').clear().type("Updated Tax 9%");

    // Save changes
    cy.get('*[class^="ui labeled icon primary button"]').click();

    cy.get("body").should("contain", "Updated Tax 9%");

    deleteTaxRateByName("Updated Tax 9%");
  });

  it("try to delete a tax rate and cancel", () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');
    cy.get('[id="criteria_search_value"]').type("7");
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Click delete button
    cy.get("button.ui.red.labeled.icon.button").not("[disabled]").click();

    // Click cancel instead of confirm
    cy.get('[class^="ui red basic cancel inverted button"]').click();

    // Assert that the tax rate is still visible
    cy.get("body").should("contain", "Sales Tax 7%");
  });

  it("validate filtering by invalid date range shows no results", () => {
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    // Set an invalid date range (end before start)
    cy.get('[id="criteria_startDate_from_date"]').type("2023-12-31");
    cy.get('[id="criteria_startDate_to_date"]').type("2023-01-01");

    // Apply filter
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Assert no results are shown
    cy.get("body").should("contain", "There are no results to display");
  });

  it("Validate if delete button is working", () => {
    // Click in tax rates in side menu
    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    cy.clickInFirst('a[href="/admin/tax-rates/"]');

    deleteTaxRateByName("Everton Tax 19%");

    // Type in value input to search for specify tax rate
    cy.get('[id="criteria_search_value"]').type("19");

    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get("body").should("not.contain", "Everton Tax 19%");
  });
});