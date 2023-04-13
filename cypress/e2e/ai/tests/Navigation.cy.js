import HomePage from '../pages/home-page';
import CuisinePage from '../pages/cuisine-page';
import Navigation from '../pages/navigation';

describe('Navigation', () => {
  const homePage = new HomePage();
  const cuisinePage = new CuisinePage();
  const navigation = new Navigation();
  beforeEach(() => {
    cy.intercept(`/api/recipe`, {
      fixture: 'mock-openai-recipe.json',
    });
    cy.intercept(`/api/image`, {
      fixture: 'mock-openai-image.json',
    });
    homePage.goto();
  });

  it('shows the correct steps in the progress indicator', () => {
    navigation.getStepIndicator('Choose ingredients').within(() => {
      cy.get('.MuiStepIcon-active');
      cy.contains('1');
    });
    navigation.getStepIndicator('Choose cuisine type').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.contains('2');
    });
    navigation.getStepIndicator('Recipe').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.contains('3');
    });

    homePage.ingredientInput().type('halloumi{enter}');
    homePage.nextButton().click();

    navigation.getStepIndicator('Choose ingredients').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.get('.MuiStepIcon-completed');
    });
    navigation.getStepIndicator('Choose cuisine type').within(() => {
      cy.get('.MuiStepIcon-active');
      cy.contains('2');
    });
    navigation.getStepIndicator('Recipe').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.contains('3');
    });

    cuisinePage.generateButton().click();

    navigation.getStepIndicator('Choose ingredients').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.get('.MuiStepIcon-completed');
    });
    navigation.getStepIndicator('Choose cuisine type').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.get('.MuiStepIcon-completed');
    });
    navigation.getStepIndicator('Recipe').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.get('.MuiStepIcon-completed');
    });
  });

  it('takes you back to the homepage and clears state when clicking "Start again"', () => {
    homePage.nextButton().should('be.disabled');
    homePage.ingredientInput().type('beans{enter}');
    homePage.nextButton().click();
    cuisinePage.customRadio().click();
    cuisinePage.cuisineInput().type('Mexican{enter}');
    navigation.startAgainButton().click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    homePage.ingredientInput().should('have.value', '');
    homePage.nextButton().should('be.disabled');
    homePage.ingredientInput().type('tomatoes{enter}');
    homePage.nextButton().click();
    cuisinePage.cuisineInput().should('have.value', '');
  });

  it('maintains state and functions correctly when using browser back/forward buttons', () => {
    homePage.ingredientInput().type('beans{enter}');
    homePage.nextButton().click();
    cuisinePage.customRadio().should('not.be.checked');
    cuisinePage.customRadio().click();
    cuisinePage.generateButton().should('be.disabled');
    cuisinePage.cuisineInput().type('Mexican{enter}');
    cy.go('back');

    navigation.getStepIndicator('Choose ingredients').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.get('.MuiStepIcon-completed');
    });
    navigation.getStepIndicator('Choose cuisine type').within(() => {
      cy.get('.MuiStepIcon-active');
      cy.contains('2');
    });
    navigation.getStepIndicator('Recipe').within(() => {
      cy.get('.MuiStepIcon-active').should('not.exist');
      cy.contains('3');
    });

    cuisinePage.cuisineInput().should('have.value', 'Mexican');
    cuisinePage.customRadio().should('be.checked');

    cy.go('back');

    homePage.ingredientChips().within(() => {
      cy.contains('beans');
    });

    cy.go('forward');

    cuisinePage.cuisineInput().should('have.value', 'Mexican');
    cuisinePage.customRadio().should('be.checked');
  });
});
