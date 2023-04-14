class HomePage {
  // Elements
  ingredientInput() {
    return cy.findByRole('textbox');
  }

  ingredientChips() {
    return cy.get('#filter-chips');
  }

  nextButton() {
    return cy.findByRole('button', { name: 'Next' });
  }

  // Actions
  goto() {
    cy.visit('/');
  }

  getIngredientChip(ingredient) {
    return this.ingredientChips().within(() => {
      cy.contains(ingredient);
    });
  }

  deleteIngredientChip(ingredient) {
    this.ingredientChips().within(() => {
      cy.contains(ingredient)
        .parent('div')
        .within(() => {
          cy.get('svg').click();
        });
    });
  }

  getStepIndicator(stepName) {
    return cy.contains('span', stepName).parents('.MuiStep-root');
  }
}

export default HomePage;
