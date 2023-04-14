class CuisinePage {
  // Elements
  cuisineInput() {
    return cy.findByRole('textbox');
  }

  customRadio() {
    return cy.findByRole('radio', { name: 'This please:' });
  }

  generateButton() {
    return cy.findByRole('button', { name: 'Generate a recipe' });
  }

  nextButton() {
    return cy.findByRole('button', { name: 'Next' });
  }

  // Actions
}

export default CuisinePage;
