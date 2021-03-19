describe('Primary ingredient search', () => {
  beforeEach(() => {
    cy.intercept(`https://api.edamam.com/search*`, {
      fixture: 'mock-response.json',
    });
    cy.visit('/');
  });

  it('Displays title', () => {
    cy.contains('h4', "What's in your fridge?");
  });
  it('Submit button enables and disables correctly', () => {
    cy.contains('Next').should('be.disabled');
    cy.get('input').type('bananas');
    cy.contains('Next').should('not.be.disabled');
  });

  it('Search returns results', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.contains('What would you like with your halloumi?');
    cy.get('button').contains('View 5 results');
  });
});
