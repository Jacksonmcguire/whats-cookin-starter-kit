class RecipeRepo {
  constructor(recipeData, userData, ingredientsData) {
    this.recipes = recipeData
      .map(recipe => new Recipe(recipe, ingredientsData));
    this.user = new User(userData);
  }

  matchTags(tags) {
    return tags.reduce((acc, tag) => {
      acc.push(...(this.recipes.filter(recipe => recipe.tags.includes(tag))));
      return acc;
    }, []);
  }

  matchIngredient(ingredientId) {
    return this.recipes.filter(recipe => {
      return recipe.ingredients.find(ingredient => {
        return ingredient.id === ingredientId
      });
    })
  }

  matchName(name) {
    return this.recipes.filter(recipe => recipe.name.includes(name));
  }
}

if (typeof module !== 'undefined') {
  module.exports = RecipeRepo;
}
