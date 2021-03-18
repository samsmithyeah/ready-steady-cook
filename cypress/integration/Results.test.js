describe('View results', () => {
  beforeEach(() => {
    cy.intercept(`https://api.edamam.com/search*`, {
      fixture: 'mock-response.json',
    });
    cy.visit('/');
  });

  it('Displays correct title for 1 ingredient', () => {
    cy.getResults('halloumi');
    cy.contains('h4', 'With your halloumi you could make...');
  });

  it('Displays correct title for 2 ingredients', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.get('input').type('onion');
    cy.get('#add-filter').click();
    cy.contains('View 1 result').click();
    cy.contains('h4', 'With your halloumi and onion you could make...');
  });

  it('Displays correct title for 3 ingredients', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.get('input').type('onion');
    cy.get('#add-filter').click();
    cy.get('input').type('oil');
    cy.get('#add-filter').click();
    cy.contains('View 1 result').click();
    cy.contains('h4', 'With your halloumi, onion and oil you could make...');
  });

  it('Displays number of results', () => {
    cy.getResults('halloumi');
    cy.contains('h6', '5 results');
  });

  it('Displays correct results', () => {
    cy.getResults('halloumi');
    cy.contains('Halloumi skewers');
    cy.contains('Grilling: Halloumi and Watermelon Salad Recipe');
    cy.contains('Asparagus & halloumi salad');
    cy.contains('Grilled Halloumi With Watercress');
    cy.contains('Grilled Peach, Halloumi, and Mint "Caprese"');
    cy.contains('BBC Good Food');
    cy.contains('Serious Eats');
    cy.contains('Jamie Oliver');
    cy.contains('Epicurious');
    cy.contains('Food52');
  });

  it('Displays filtered results', () => {
    cy.get('input').type('halloumi');
    cy.contains('Next').click();
    cy.get('input').type('onion');
    cy.get('#add-filter').click();
    cy.contains('View 1 result').click();
    cy.contains('h6', '1 result');
    cy.contains('Asparagus & halloumi salad');
    cy.contains('Halloumi skewers').should('not.exist');
    cy.contains('Grilling: Halloumi and Watermelon Salad Recipe').should(
      'not.exist',
    );
    cy.contains('Grilled Halloumi With Watercress').should('not.exist');
    cy.contains('Grilled Peach, Halloumi, and Mint "Caprese"').should(
      'not.exist',
    );
  });
  it('Displays correct link', () => {
    cy.getResults('halloumi');
    cy.contains('Halloumi skewers').should(
      'have.attr',
      'href',
      'https://www.bbcgoodfood.com/recipes/halloumi-skewers',
    );
  });
});
