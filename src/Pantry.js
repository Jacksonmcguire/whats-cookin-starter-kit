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
    // INPUT: recipe, array missing the ingredient(s) called for
    // OUTPUT: array of missing ingredients(not amounts)
    // iterate recipe ingredients and filter to an array of those not found
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
    //remove ingredients from pantry
    // INPUT: recipe
    // OUTPUT: None (Updates each ingredient,
    //            subtracting amount of recipe from pantry)

  }

}
module.exports = Pantry;
