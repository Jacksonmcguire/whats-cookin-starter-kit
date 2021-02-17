const chai = require('chai');
const expect = chai.expect;

const recipeTestData = require('../test-data/recipe-test-data');
const usersData = require('../test-data/user-test-data');
const ingredientsTestData = require('../test-data/ingredient-test-data');

const RecipeRepo = require('../src/RecipeRepo');
const Pantry = require('../src/Pantry')

describe ('Pantry', () => {
  const recipeData = recipeTestData.recipeData;
  const userData = usersData.usersData;
  const ingredientsData = ingredientsTestData.ingredientsData;
  let recipeRepo;
  let recipeNumberOne;
  let pantry;

  beforeEach('create a recipe repository', () => {
    recipeRepo = new RecipeRepo(recipeData, userData, ingredientsData);
    recipeNumberOne = recipeRepo.recipes[0];
    pantry = recipeRepo.user.pantry;
  });

  it('should instantiate a Pantry for a User instance', () => {
    expect(pantry).to.be.an.instanceOf(Pantry);
  });

  it('should have ingredients', () => {
    expect(pantry.pantryData).to.have.a.lengthOf(5);
  });

  it('should store multiple ingredients\' names and amounts', () => {
    expect(pantry.pantryData[0].ingredient).to.deep.equal(23);
    expect(pantry.pantryData[0].amount).to.deep.equal(66);
    expect(pantry.pantryData[1].ingredient).to.deep.equal(27);
    expect(pantry.pantryData[1].amount).to.deep.equal(77);
  });

  describe('Search Pantry', () => {
    it('should know if there are enough ingredients for a recipe', () => {
      expect(pantry.isSupplyFor(recipeNumberOne)).to.deep.equal(true);
    });

    it('should alert what is needed if there is not enough supply', () => {
      expect(pantry.isSupplyFor(recipeRepo.recipes[2])).to.deep.equal(['barbarol']);
    });

    it ('should know if an item is located in the pantry', () => {
      expect(pantry.isPantryItem(pantry.pantryData[0].amount, recipeNumberOne.ingredientsData))
        .to.deep.equal(true);
      expect(pantry.isPantryItem(pantry.pantryData[1].amount, recipeRepo.recipes[1].ingredientsData))
        .to.deep.equal(true);
      expect(pantry.isPantryItem(pantry.pantryData[2].amount, recipeRepo.recipes[2].ingredientsData))
        .to.deep.equal(false);
    });

    it ('should determine if an item is not located in the pantry what exactly is missing', () => {
      expect(pantry.determineMissing(recipeNumberOne.ingredientsData,
        [
          {
            id: 23,
            quantity: { amount: 42, unit: 'octoban' },
            amount: 42,
            unit: 'octoban'
          },
          {
            id: 27,
            quantity: { amount: 28, unit: 'oz' },
            amount: 28,
            unit: 'oz'
          }
        ]))
        .to.have.lengthOf(0);
      expect(pantry.determineMissing(recipeRepo.recipes[1].ingredientsData,
        [
          {
            id: 31,
            quantity: { amount: 28, unit: 'oz' },
            amount: 28,
            unit: 'oz'
          }
        ]))
        .to.deep.equal(['bootstraps']);
      expect(pantry.determineMissing(recipeRepo.recipes[2].ingredientsData,
        [
          {
            'id': 27,
            'quantity': {
              'amount': 85,
              'unit': 'octoban'
            }
          },
          {
            'id': 31,
            'quantity': {
            'amount': 28,
            'unit': 'oz'
            }
          }
        ])).to.deep.equal([]);
    });

    it('should find missingingredients that are required for the recipe', () => {
      expect(pantry.findMissingIngredients(recipeNumberOne.ingredientsData,
        [
          {
            id: 23,
            quantity: { amount: 42, unit: 'octoban' },
            amount: 42,
            unit: 'octoban'
          },
          {
            id: 27,
            quantity: { amount: 28, unit: 'oz' },
            amount: 28,
            unit: 'oz'
          }
        ]))
        .to.have.lengthOf(0);
      expect(pantry.determineMissing(recipeRepo.recipes[1].ingredientsData,
        [
          {
            id: 31,
            quantity: { amount: 28, unit: 'oz' },
            amount: 28,
            unit: 'oz'
          }
        ]))
        .to.deep.equal(['bootstraps']);
      expect(pantry.determineMissing(recipeRepo.recipes[2].ingredientsData,
        [
          {
            'id': 27,
            'quantity': {
              'amount': 85,
              'unit': 'octoban'
            }
          },
          {
            'id': 23,
            'quantity': {
            'amount': 28,
            'unit': 'oz'
            }
          }
        ])).to.deep.equal(['cherries']);
    });

    it('should find know only the name of the missing ingredients that are required for the recipe', () => {
      expect(pantry.findMissingIngredients(recipeNumberOne.ingredientsData,
        [
          {
            id: 23,
            quantity: { amount: 42, unit: 'octoban' },
            amount: 42,
            unit: 'octoban'
          },
          {
            id: 27,
            quantity: { amount: 28, unit: 'oz' },
            amount: 28,
            unit: 'oz'
          }
        ]))
        .to.have.lengthOf(0);
      expect(pantry.determineMissing(recipeRepo.recipes[1].ingredientsData,
        [
          {
            id: 31,
            quantity: { amount: 28, unit: 'oz' },
            amount: 28,
            unit: 'oz'
          }
        ]))
        .to.deep.equal(['bootstraps']);
      expect(pantry.determineMissing(recipeRepo.recipes[2].ingredientsData,
        [
          {
            'id': 27,
            'quantity': {
              'amount': 85,
              'unit': 'octoban'
            }
          },
          {
            'id': 23,
            'quantity': {
            'amount': 28,
            'unit': 'oz'
            }
          }
        ])).to.deep.equal(['cherries']);
    });


    it('should remove ingredients from pantry when a feature is cooked', () => {
      pantry.cookFeature(recipeNumberOne);
      expect(pantry.pantryData).to.deep.equal([
        { "ingredient": 23,
          "amount": 24
        },
        { "ingredient": 27,
          "amount": 49
        },
        {
          "ingredient": 31,
          "amount": 80
        },
        {
          "ingredient": 66,
          "amount": 92
        },
        {
          "ingredient": 24,
          "amount": 54
        }
      ]);
    });
  });
});
