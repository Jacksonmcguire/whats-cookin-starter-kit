class Pantry {
  constructor(userPantryData) {
    this.pantryData = userPantryData;
  }

  isSupplyFor(recipe) {
    const passingIngredients = recipe.ingredients.filter(ingredient => {
      let recipeAmount = ingredient.quantity.amount;
      //console.log("PANTRY DATA:", this.pantryData)
      let pantryItem = this.pantryData.find(item => {
        //console.log("ING DATA:", recipe.ingredientsData);
        return item.ingredient === (recipe.ingredientsData
          .find(ing => ing.id === item.ingredient) || []).id;
      });
      return (pantryItem || []).amount > recipeAmount;
    });
    //console.log(passingIngredients.length)
    if (passingIngredients.length === recipe.ingredients.length) {
      return true;
    } else {
      return this.determineMissing(recipe, passingIngredients);
    }
  }

  determineMissing(recipe, passingIngredients) {
    const missingIngredients = recipe.ingredients.filter(ingredient => {
      return !passingIngredients.includes(ingredient);
    });
    //console.log("MISSING ING:", missingIngredients)
    let missingIngredientName;
    missingIngredients.forEach(ingredient => {
      //console.log("THIS:", ingredient.id);
      const missing = recipe.ingredientsData.find(dataIngredient => {
        return dataIngredient.id === ingredient.id;
      });
      //console.log("missing:", missing.name)
      missingIngredientName = (missing || []).name;
    })
    return missingIngredientName;
  }

  cookFeature(recipe) {
      recipe.ingredients.forEach(recipeIngredient => {
      let recipeAmount = recipeIngredient.quantity.amount;
      let pantryItem = this.pantryData.find(item => {
        return item.ingredient === recipeIngredient.id;
      });
      pantryItem.amount -= recipeAmount;
      // console.log(recipe.ingredients);
      // console.log(pantryItem.amount, recipeAmount)
    });
  }
}

module.exports = Pantry;
