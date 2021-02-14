// if (typeof module !== undefined) {
//   Pantry = require('./Pantry');
// }

class User {
  constructor(userData, ingredientsData) {
    this.user = userData;
    this.name = userData.name;
    this.id = userData.id;
    this.pantry = new Pantry(userData.pantry);
    this.favorites = [];
    this.planned = [];
    this.ingredientsData = ingredientsData;
  }
  addFavorite(recipe) {
    this.favorites.push(recipe);
  }
  removeFavorite(recipe) {
    if (this.favorites[0]) {
      const index = this.favorites.indexOf(recipe);
      this.favorites.splice(index, 1);
    }
  }
  getFavoritesByTags(tags) {
    return tags.reduce((acc, tag) => {
      acc.push(...(this.favorites.filter(recipe => recipe.tags.includes(tag))));
      return acc;
    }, []);
  }

  getFavoritesByName(recipeName) {
    return this.favorites.filter(recipe => recipe.name === recipeName);
  }

  getFavoritesByIngredient(searchIngredientName) {
    const ingredientId = this.ingredientsData.find(ingredient => {
      return ingredient.name === searchIngredientName
    }).id;
    const filteredFavorites = this.favorites.filter(recipe => {
      return recipe.ingredients.find(({id}) => id === ingredientId);
    });
    return filteredFavorites;
  }

  addPlanned(recipe) {
    this.planned.push(recipe);
  }
}

if (typeof module !== undefined) {
  module.exports = User;
}
