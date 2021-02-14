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

  beforeEach('create a recipe repository', () => {
    recipeRepo = new RecipeRepo(recipeData, userData, ingredientsData);
    recipeNumberOne = recipeRepo.recipes[0];
    pantry = recipeRepo.user.pantry;
  });

  it('should instantiate a Pantry for a User instance', () => {
    expect(pantry).to.be.an.instanceOf(Pantry);
  });

  it('should have ingredients', () => {
    expect(pantry.pantryData).to.have.a.lengthOf(2);
  });

  it('should store multiple ingredients\' names and amounts', () => {
    expect(pantry.pantryData[0].ingredient).to.deep.equal('gumdrops');
    expect(pantry.pantryData[0].amount).to.deep.equal(66);
    expect(pantry.pantryData[1].ingredient).to.deep.equal('barbarol');
    expect(pantry.pantryData[1].amount).to.deep.equal(77);
  });

  describe('Search Pantry', () => {
    it('should know if there are enough ingredients for a recipe', () => {
      expect(pantry.isSupplyFor(recipeNumberOne)).to.deep.equal(true);
      expect(pantry.isSupplyFor(recipeRepo.recipes[1])).to.deep.equal('cherries');
      //console.log(recipeRepo.recipes[2]);
      //console.log(pantry)
    });

    it('should alert what is needed if there is not enough supply', () => {
      expect(pantry.isSupplyFor(recipeRepo.recipes[1])).to.deep.equal('cherries');
      expect(pantry.isSupplyFor(recipeRepo.recipes[2])).to.deep.equal('barbarol');
    });

    it('should remove ingredients from pantry when a feature is cooked', () => {
      pantry.cookFeature(recipeNumberOne);
      console.log(pantry.pantryData);
      expect(pantry.ingredients).to.deep.equal(pantry.ingredients);
    });

    it('should start with a fresh pantry and try that again', () => {
      pantry.cookFeature(recipeNumberOne);

      expect(pantry.ingredients).to.deep.equal(pantry.ingredients);
    });

    it('should start with a fresh pantry and try that again', () => {
      pantry.cookFeature(recipeNumberOne);

      expect(pantry.ingredients).to.deep.equal(pantry.ingredients);
    });

    it('should allow a user to cook a recipe', () => {
      pantry.cookFeature(recipeNumberOne);

      
    });

  });
});
