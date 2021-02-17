class Pantry {
  constructor(userPantryData) {
    this.pantryData = userPantryData;
  }

  isSupplyFor({ ingredients, ingredientsData }) {
    const passingIngredients = ingredients.filter(ingredient => {
      const recipeAmount = ingredient.quantity.amount;
      return this.isPantryItem(recipeAmount, ingredientsData);
    });
    if (passingIngredients.length === ingredients.length) {
      return true;
    } else {
      return this.determineMissing(ingredientsData, passingIngredients);
    }
  }

  isPantryItem(recipeAmount, ingredientsData) {
    const pantryItem = this.pantryData.find(item => {
      return item.ingredient === (ingredientsData
        .find(dataIngredient => dataIngredient.id === item.ingredient) || []).id;
    });
    if (pantryItem) {
      return pantryItem.amount >= recipeAmount;
    } else {
      return false;
    }
  }

  determineMissing(ingredientsData, passingIngredients) {
    const missingIngredients = ingredientsData.filter(ingredient => {
      const { id } = ingredient;
      const foundId = passingIngredients.find(passing => passing.id === id)
      return !foundId;
    });
    const missingIngredientsNames = missingIngredients.map(ingredient => {
      const missingIngredient = ingredientsData.find(dataIngredient => {
        return dataIngredient.id === ingredient.id;
      });
      return missingIngredient;
    });
    return missingIngredientsNames.map(i => {
      return missingIngredientsNames[missingIngredientsNames.indexOf(i)].name
    });

  }

  cookFeature({ ingredients }) {
    ingredients.forEach(recipeIngredient => {
      const recipeAmount = recipeIngredient.quantity.amount;
      const pantryItem = this.pantryData.find(item => {
        return item.ingredient === recipeIngredient.id;
      });
      pantryItem.amount -= recipeAmount;
    });
  }
}


module.exports = Pantry;
