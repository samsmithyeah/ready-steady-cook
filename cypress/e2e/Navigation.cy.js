describe('Navigation', () => {
  beforeEach(() => {
    cy.intercept(`https://api.edamam.com/search*`, {
      fixture: 'mock-response.json',
    });
    cy.visit('/');
    cy.get('[name="mode"]').uncheck();
  });

  it('shows the correct step in the progress indicator: Search page', () => {
    cy.contains('span', 'Primary ingredient')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active');
        cy.contains('1');
      });
    cy.contains('span', 'Other ingredients')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.contains('2');
      });
    cy.contains('span', 'Results')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.contains('3');
      });
  });

  it('shows the correct step in the progress indicator: Filter page', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();

    cy.contains('span', 'Primary ingredient')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.get('.MuiStepIcon-completed');
      });
    cy.contains('span', 'Other ingredients')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active');
        cy.contains('2');
      });
    cy.contains('span', 'Results')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.contains('3');
      });
  });

  it('shows the correct step in the progress indicator: Results page', () => {
    cy.getResults('halloumi');

    cy.contains('span', 'Primary ingredient')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.get('.MuiStepIcon-completed');
      });
    cy.contains('span', 'Other ingredients')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.get('.MuiStepIcon-completed');
      });
    cy.contains('span', 'Results')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.get('.MuiStepIcon-completed');
      });
  });

  it('takes you back to the homepage and clears state when clicking "Start again"', () => {
    cy.get('#search').type('halloumi');
    cy.contains('Next').click();
    cy.get('#filter').type('onion');
    cy.get('#add-filter').click();
    cy.contains('View 1 result').click();
    cy.contains('Start again').click();
    cy.contains('h4', "What's in your fridge?");
    cy.get('input').should('have.value', '');
    cy.contains('Next').should('be.disabled');

    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.contains('onion').should('not.exist');
  });

  it('maintains state and functions correctly when using browser back/forward buttons', () => {
    cy.get('#search').type('halloumi');
    cy.contains('Next').click();
    cy.get('#filter').type('onion');
    cy.get('#add-filter').click();
    cy.contains('View 1 result').click();

    cy.go('back');

    cy.contains('span', 'Primary ingredient')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.get('.MuiStepIcon-completed');
      });
    cy.contains('span', 'Other ingredients')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active');
        cy.contains('2');
      });
    cy.contains('span', 'Results')
      .parents('.MuiStep-root')
      .within(() => {
        cy.get('.MuiStepIcon-active').should('not.exist');
        cy.get('.MuiStepIcon-completed').should('not.exist');
        cy.contains('3');
      });

    cy.contains('h4', 'What would you like with your halloumi?');
    cy.get('#filter-chips').within(() => {
      cy.contains('onion');
    });
  });
});
