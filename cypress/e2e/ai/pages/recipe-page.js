class RecipePage {
  // Elements

  // Actions
  gotoRecipe(uuid) {
    cy.visit(`/recipe/${uuid}`);
  }
}

export default RecipePage;
