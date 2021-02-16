class Pantry {
  constructor(userPantryData) {
    this.pantryData = userPantryData;
  }

  // isSupplyFor(recipe) {
  //   const passingIngredients = recipe.ingredients.filter(ingredient => {
  //     let recipeAmount = ingredient.quantity.amount;
  //     //console.log("PANTRY DATA:", this.pantryData)
  //     let pantryItem = this.pantryData.find(item => {
  //       //console.log("ING DATA:", recipe.ingredientsData);
  //       return item.ingredient === (recipe.ingredientsData
  //         .find(ing => ing.id === item.ingredient) || []).id;
  //     });
  //     return (pantryItem || []).amount > recipeAmount;
  //   });
  //   //console.log(passingIngredients.length)
  //   if (passingIngredients.length === recipe.ingredients.length) {
  //     return true;
  //   } else {
  //     return this.determineMissing(recipe, passingIngredients);
  //   }
  // }
  isSupplyFor({ id, ingredients, ingredientsData }) {
    const passingIngredients = ingredients.filter(ingredient => {
      let recipeAmount = ingredient.quantity.amount;
      //console.log("PANTRY DATA:", this.pantryData)
      let pantryItem = this.pantryData.find(item => {
        //console.log("ING DATA:", recipe.ingredientsData);
        return item.ingredient === (ingredientsData
          .find(ing => ing.id === item.ingredient) || []).id;
      });
      if (pantryItem) {
        //console.log('FOUND PANTRY ITEM: ', pantryItem)
        //console.log('RecipeAmount: ', recipeAmount);
        return pantryItem.amount >= recipeAmount;
      } else return false;
    });
    //console.log("passingIngredients.length", passingIngredients.length)
    if (passingIngredients.length === ingredients.length) {
      return true;
    } else {
      return this.determineMissing(ingredientsData, passingIngredients);
    }
  }

  // determineMissing(recipe, passingIngredients) {
  //   const missingIngredients = recipe.ingredients.filter(ingredient => {
  //     return !passingIngredients.includes(ingredient);
  //   });
  //   //console.log("MISSING ING:", missingIngredients)
  //   let missingIngredientName;
  //   const missingIngredientsNames = missingIngredients.map(ingredient => {
  //     //console.log("THIS:", ingredient.id);
  //     const missing = recipe.ingredientsData.find(dataIngredient => {
  //       return dataIngredient.id === ingredient.id;
  //     });
  //     //console.log("missing:", missing.name)
  //     missingIngredientName = (missing || []).name;
  //   })
  //   return missingIngredientsNames;
  // }

  determineMissing(ingredientsData, passingIngredients) {
    //console.log("PASSING INGREDIENT ARRAY:", passingIngredients)
    const missingIngredients = ingredientsData.filter(ingredient => {
      let { id } = ingredient;
      let foundId = passingIngredients.find(passing => passing.id === id);
      return !foundId;
    });
    //console.log("MISSING INGREDIENT ARRAY:", missingIngredients)
    let missingIngredient;
    const missingIngredientsNames = missingIngredients.map(ingredient => {
    //console.log("THIS:", ingredient.id);
      missingIngredient = ingredientsData.find(dataIngredient => {
        return dataIngredient.id === ingredient.id;
      });
      //console.log("missing:", missingIngredient.name)
      return missingIngredient;
    });
    const missingNames = missingIngredientsNames.map(i => missingIngredientsNames[missingIngredientsNames.indexOf(i)].name)
    //missingIngredientsNames.forEach(i => console.log('Failed Names: ', missingIngredientsNames[missingIngredientsNames.indexOf(i)].name))
    // console.log('NEW MISSING NAMES', missingNames)
    // console.log('PANTRY: ',this.pantryData);
    // console.log(" ");
    // console.log('Recipe: ', recipe.ingredients)
    // console.log(" ")
    // console.log('Recipe Data: ', recipe.ingredientsData)
    // console.log(" ")
    // console.log('Passing Names: ', passingIngredients)
    // console.log(" ")
    return missingNames;
  }

  cookFeature({ ingredients }) {
    ingredients.forEach(recipeIngredient => {
      let recipeAmount = recipeIngredient.quantity.amount;
      let pantryItem = this.pantryData.find(item => {
        //console.log('COOK FUNC PANTRY ITEM ING ID: ', item.ingredient, "RECIPE ID: ", recipeIngredient.id)
        return item.ingredient === recipeIngredient.id;
      });
      //console.log("pantryItem: ", pantryItem)
      //console.log("recipeAmount needs: ", recipeAmount)
      //console.log("pantryItem amount: ", pantryItem.amount )
      pantryItem.amount -= recipeAmount;
      //console.log("ingredients: ", ingredients);
    });
  }
}

module.exports = Pantry;
