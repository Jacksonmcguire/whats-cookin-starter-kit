class Pantry {
  constructor(userPantryData) {
    this.pantryData = userPantryData;
  }

  isSupplyFor({ ingredients, ingredientsData }) {
    const passingIngredients = ingredients.filter(ingredient => {
      const recipeAmount = ingredient.quantity.amount;
      const pantryItem = this.pantryData.find(item => { //const
        return item.ingredient === (ingredientsData
          .find(dataIngredient => dataIngredient.id === item.ingredient) || []).id;
      });
      if (pantryItem) {
        return pantryItem.amount >= recipeAmount;
      } else {
        return false;
      }
    });
    if (passingIngredients.length === ingredients.length) {
      return true;
    } else {
      return this.determineMissing(ingredientsData, passingIngredients);
    }
  }

  determineMissing(ingredientsData, passingIngredients) {
    const missingIngredients = ingredientsData.filter(ingredient => {
      const { id } = ingredient;
      const foundId = passingIngredients.find(passing => passing.id === id)
      return !foundId;
    });
    const missingIngredientsNames = missingIngredients.map(ingredient => {
      let missingIngredient = ingredientsData.find(dataIngredient => {
        return dataIngredient.id === ingredient.id;
      });
      return missingIngredient;
    });
    const missingNames = missingIngredientsNames.map(i => missingIngredientsNames[missingIngredientsNames.indexOf(i)].name)
    return missingNames;
  }

  cookFeature({ ingredients }) {
    ingredients.forEach(recipeIngredient => {
      let recipeAmount = recipeIngredient.quantity.amount;
      let pantryItem = this.pantryData.find(item => {
        return item.ingredient === recipeIngredient.id;
      });
      pantryItem.amount -= recipeAmount;
    });
  }
}


module.exports = Pantry;
