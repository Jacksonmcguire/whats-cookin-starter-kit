class User {
  constructor(userData) {
    this.user = userData;
    this.name = userData.name;
    this.id = userData.id;
    this.pantry = new Pantry(userData.pantry);
    this.favorites = [];
    this.planned = [];
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
    return this.favorites.filter(recipe => recipe.name.includes(recipeName));
  }

  getFavoritesByIngredient(ingredientId) {
    return this.favorites.filter(favorite => {
      return favorite.ingredients.find(ingredient => {
        return ingredient.id === ingredientId
      });
    })
  }

  addPlanned(recipe) {
    this.planned.push(recipe);
  }
}

if (typeof module !== undefined) {
  module.exports = User;
}
