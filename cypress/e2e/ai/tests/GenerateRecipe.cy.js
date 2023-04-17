import HomePage from '../pages/home-page';
import CuisinePage from '../pages/cuisine-page';
import RecipePage from '../pages/recipe-page';

describe('E2E journey for generating a recipe', () => {
  const homePage = new HomePage();
  const cuisinePage = new CuisinePage();
  const recipePage = new RecipePage();
  const ingredients = ['halloumi', 'onion', 'garlic'];
  const mockImageUrl =
    'https://realfood.tesco.com/media/images/RFO-HALLOUMI-Thumb-146x128-mini-8319d2f1-aea1-45ab-bb68-bbb4fee6b39d-0-146x128.jpg';

  beforeEach(() => {
    cy.intercept('/api/recipe', {
      fixture: 'mock-openai-recipe.json',
    });
    cy.intercept('/api/image', {
      fixture: 'mock-openai-image.json',
    });
    cy.intercept('https://wzrhbqgdfpnqlwpgmele.supabase.co/rest/v1/recipes*', {
      fixture: 'mock-supabase-response.json',
    });
  });

  it('Displays and deletes ingredient chips', () => {
    homePage.goto();
    ingredients.forEach((ingredient) => {
      homePage.ingredientInput().type(`${ingredient}{enter}`);
    });

    ingredients.forEach((ingredient) => {
      cy.contains(ingredient);
    });

    homePage.deleteIngredientChip('onion');
    homePage.ingredientChips().within(() => {
      cy.contains('onion').should('not.exist');
      cy.contains('halloumi');
      cy.contains('garlic');
    });
  });

  it('Generates a new recipe', () => {
    homePage.goto();
    ingredients.forEach((ingredient) => {
      homePage.ingredientInput().type(`${ingredient}{enter}`);
    });
    homePage.nextButton().click();
    cuisinePage.generateButton().click();
    cy.contains(
      'h4',
      `With your ${ingredients[0]}, ${ingredients[1]} and ${ingredients[2]} you could make...`,
    );
    cy.contains('h1', 'E2E MOCK Spicy Halloumi and Onion Curry');
    cy.get('img').should('have.attr', 'src', mockImageUrl);
  });

  it('Fetches a pre-existing recipe', () => {
    recipePage.gotoRecipe('d12e90af-cab8-4a44-9a22-8902c5499ddc');
    cy.contains('h4', 'With your bacon and eggs you could make...');
    cy.contains(
      'h1',
      'E2E MOCKED PRE-EXISTING Chinese Bacon and Egg Fried Rice',
    );
    cy.get('img').should('have.attr', 'src', mockImageUrl);
  });
});
