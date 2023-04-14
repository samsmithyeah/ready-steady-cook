class Navigation {
  // Elements

  startAgainButton() {
    return cy.findByRole('button', { name: 'Start again' });
  }

  // Actions
  getStepIndicator(stepName) {
    return cy.contains('span', stepName).parents('.MuiStep-root');
  }
}

export default Navigation;
