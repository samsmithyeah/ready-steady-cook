describe('Filter results', () => {
  beforeEach(() => {
    cy.intercept(`https://api.edamam.com/search*`, {
      fixture: 'mock-response.json',
    });
    cy.visit('/');
  });

  it('Displays title', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.contains('h4', 'What would you like with your halloumi?');
  });
  it('Displays filter chips', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.get('input').type('onion');
    cy.get('#add-filter').click();
    cy.get('input').type('garlic');
    cy.get('#add-filter').click();
    cy.get('#filter-chips').within(() => {
      cy.contains('onion');
      cy.contains('garlic');
    });
  });

  it('Deletes filters', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.get('input').type('onion');
    cy.get('#add-filter').click();
    cy.get('input').type('garlic');
    cy.get('#add-filter').click();
    cy.get('button').contains('No results');
    cy.get('#filter-chips').within(() => {
      cy.contains('garlic')
        .parent('div')
        .within(() => {
          cy.get('svg').click();
        });
      cy.contains('garlic').should('not.exist');
      cy.contains('onion');
    });
    cy.get('button').contains('View 1 result');
  });

  it('Add filter button enables and disables correctly', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.get('#add-filter').should('be.disabled');
    cy.get('input').type('chilli');
    cy.get('#add-filter').should('not.be.disabled');
  });
});
