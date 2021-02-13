const Ingredient = require('./Ingredient');


class Pantry {
  constructor(userPantryData) {
    this.pantryData = userPantryData;
  }

  isSupplyFor(recipe) {
    const passingIngredients = recipe.ingredients.filter(ingredient => { //has Id only
      let recipeAmount = ingredient.quantity.amount;
      let pantryItem = this.pantryData.find(item => {
        //console.log(recipe.IngredientsData);
        return item.ingredient === (recipe.ingredientsData.find(ing => ing.name === item.ingredient) || []).name;
      });
        //console.log(pantryItem)
      return (pantryItem || []).amount > recipeAmount;
    });
    //console.log(passingIngredients.length)
    return passingIngredients.length === recipe.ingredients.length;
  }
}
module.exports = Pantry;
