const chai = require('chai');
const expect = chai.expect;

const recipeTestData = require('../test-data/recipe-test-data');
const usersData = require('../test-data/user-test-data');
const ingredientsTestData = require('../test-data/ingredient-test-data');

const RecipeRepo = require('../src/RecipeRepo');

describe ('Recipe', () => {
  const recipeData = recipeTestData.recipeData;
  const userData = usersData.usersData;
  const ingredientsData = ingredientsTestData.ingredientsData;
  let recipeRepo;
  let recipeNumberOne;

  beforeEach('create a recipe repository', () => {
    recipeRepo = new RecipeRepo(recipeData, userData, ingredientsData);
    recipeNumberOne = recipeRepo.recipes[0];
  });


  it('should have an id number', () => {

    expect(recipeRepo.recipes[1].id).to.deep.equal(2011);
  });

  it('should have an image', () => {

    expect(recipeNumberOne.image).to.deep.equal(
      'https://i.pinimg.com/originals/ee/28/89/ee288996db69afeb8ec5cbf84f8c0d10.jpg');
  });

  it('should have tags', () => {

    expect(recipeNumberOne.tags).to.deep.equal(['chocolate', 'cheese']);
  });

  it('should have a name', () => {

    expect(recipeNumberOne.name).to.deep.equal('fluffer-nutter');
  });

  it('should have instructions', () => {

    expect(recipeNumberOne.instructions).to.deep.equal(recipeData[0].instructions);
  });

  it('should instantiate an ingredient', () => {
    expect(recipeNumberOne.ingredients[0].id).to.deep.equal(23);
  });

  it('should have an ingredients list', () => {

    expect(recipeNumberOne.ingredients[0].quantity.unit).to.deep.equal('octoban');
  });

  describe('Inquiries', () => {

    it('should determine names of needed ingredients', () => {
      const ingredientsNeeded = recipeNumberOne.getIngredients();

      expect(ingredientsNeeded).to.deep.equal([
        {
          id: 23,
          quantity: { amount: 42, unit: 'octoban' },
          amount: 42,
          unit: 'octoban',
          nameObj: { id: 23, name: 'gumdrops', estimatedCostInCents: 42 }
        },
        {
          id: 27,
          quantity: { amount: 28, unit: 'oz' },
          amount: 28,
          unit: 'oz',
          nameObj: { id: 27, name: 'barbarol', estimatedCostInCents: 582 }
        }
      ])
    });

    it('should get the total cost of the ingredients', () => {
      const cost = recipeNumberOne.getCost();

      expect(cost).to.deep.equal('180.60')
    });

    it('should return instructions', () => {

      const instructions = recipeNumberOne.getInstructions();

      expect(instructions).to.deep.equal([{instruction:
      'Get a paddle and some marshmallows and peanut butter', number: 1},
      { instruction: 'Whip it good. With a Whisk. Whip it!', number: 2 }
      ]);
    });

  });
});
