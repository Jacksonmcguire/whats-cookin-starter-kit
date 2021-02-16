
const currentRecipeContainer = document
  .querySelector('.current-recipe-container');
const currentRecipeIngredients = currentRecipeContainer
  .querySelector('.current-recipe-ingredients');
const currentRecipeInstructions = currentRecipeContainer
  .querySelector('.current-recipe-instructions');
const currentRecipeTitle = currentRecipeContainer
  .querySelector('.current-recipe-title');
const currentTitleContainer = currentRecipeContainer
.querySelector('.current-recipe-title-container')
const currentRecipeImg = currentRecipeContainer
.querySelector('.current-recipe-img')
const recipeList = document.querySelector('.recipe-list');
const pantryContainer = document.querySelector('.pantry-container');
const pantryInfo = document.querySelector('.my-ingredients');
const pantryTitle = document.querySelector('.pantry-title');
const tagContainer = document.querySelector('.tag-container');
const buttonContainer = document.querySelector('.button-container');
const searchForm = document.querySelector('.search-container');
const myListBtn = currentRecipeContainer.querySelector('.my-list-btn');
const removeMyList = currentRecipeContainer.querySelector('.remove-my-list');
const cookBtn = currentRecipeContainer.querySelector('.cook-btn')
const goHomeBtn = buttonContainer.querySelector('#goHomeBtn');
const showFavBtn = buttonContainer.querySelector('#showFavBtn');
const showPlannedBtn = buttonContainer.querySelector('#myPlannedBtn');
const favBtns = recipeList.querySelectorAll('.favorite-input');
const nextPageArrow = recipeList.querySelector('.right');
const prevPageArrow = recipeList.querySelector('.left');
const userMessage = document.querySelector('.user-message');
const recipeRepo = new RecipeRepo(recipeData, 
  usersData[Math.floor(Math.random() * usersData.length)], ingredientsData);
const recipeCards = recipeList.querySelectorAll('.recipe-card');
let pageViewArr = [true, false, false]
let currentFilters = [];
let currentRecipes = recipeRepo.recipes;


recipeList.addEventListener('click', clickRecipeCard);
window.addEventListener('load', openPage);
nextPageArrow.addEventListener('click', showNextPage);
prevPageArrow.addEventListener('click', showPrevPage);
tagContainer.addEventListener('click', clickTagFilter);
searchForm.addEventListener('submit', submitSearch);
goHomeBtn.addEventListener('click', goHome);
showFavBtn.addEventListener('click', showFavorites);
myListBtn.addEventListener('click', addToMyList);
showPlannedBtn.addEventListener('click', showPlannedRecipes);
removeMyList.addEventListener('click', removePlannedRecipe);
cookBtn.addEventListener('click', cookRecipe);



function openPage() {
  generateRecipeCards(currentRecipes, 0);
  favBtns.forEach(favBtn => favBtn.addEventListener('click', favoriteRecipe));
}

function changeClassName(elementArr, className, change = false) {
  if (change) {
    elementArr.forEach(element => {
      element.classList.add(className);
    })
  } else {
    elementArr.forEach(element => {
      element.classList.remove(className);
    })
  }
}

function goHome() {
  generateRecipeCards(recipeRepo.recipes, 0);
  pageViewArr[0] = true;
  pageViewArr[1] = false; pageViewArr[2] = false;
  changeClassName([tagContainer, nextPageArrow, showPlannedBtn, searchForm], 'vis-hidden')
  changeClassName([tagContainer, showFavBtn, showPlannedBtn], 'hidden');
  eraseTags();
  changeClassName([prevPageArrow, currentRecipeContainer], 'vis-hidden', true);
  changeClassName([pantryContainer], 'hidden', true);
}

function eraseTags() {
  const tags = tagContainer.querySelectorAll('input');
  tags.forEach(tag => {
    tag.labels[0].classList.remove('tag-label-checked');
  })
}

function addToMyList() {
  const currentTitle = currentRecipeTitle.innerText
  const featuredRecipe = currentRecipes.find(recipe => recipe.name === currentTitle);
  recipeRepo.user.addPlanned(featuredRecipe);
}

function searchFavorites(searchValue, decision = false) {
  if (decision) {
    generateRecipeCards(recipeRepo.user.getFavoritesByIngredient(searchValue), 0);
  } else {
    generateRecipeCards(recipeRepo.user.getFavoritesByName(searchValue), 0);
  }
}

function determineFavorite(recipe) {
  if (recipeRepo.user.favorites.includes(recipe)) {
    return true
  } else {
    return false
  }
}

function showPlannedRecipes() {
  const uniquePlanned = recipeRepo.user.planned.filter((plannedRecipe, index) => {
    return recipeRepo.user.planned.indexOf(plannedRecipe) === index;
  })
  pageViewArr[2] = true; 
  pageViewArr[1] = false; pageViewArr[0] = false;
  generateRecipeCards(uniquePlanned, 0);
  checkPantry();
  changeClassName([tagContainer], 'hidden', true);
  changeClassName([prevPageArrow, showPlannedBtn, searchForm], 'vis-hidden', true);
}

function randomizeCardColor(recipeCard) {
  const colorArr = ['green-card', 'blue-card', 'orange-card', 'pink-card', 'cyan-card'];
  var color = colorArr[Math.floor(Math.random() * colorArr.length)];
  recipeCard.classList = `recipe ${color}`;
}
function checkPantry() {
  pageViewArr[1] = false; pageViewArr[2] = true;
  tagContainer.classList.add('hidden');
  pantryContainer.classList.remove('hidden');
  pantryTitle.innerText = `${recipeRepo.user.name}'s Pantry`;
  showPantry();
  changeClassName([tagContainer], 'hidden', true);
  changeClassName([pantryContainer], 'hidden');
}

function showPantry() {
  recipeRepo.user.pantry.pantryData.forEach(ingredientObj => {
    const matchingIngredient = ingredientsData.find(ingredient => 
      ingredient.id === ingredientObj.ingredient);
    const currentP = document.createElement('p');
    pantryInfo.appendChild(currentP);
    const matchingRecipe = recipeRepo.recipes.find(recipe => recipe.ingredients
      .find(recipeIngredient => recipeIngredient.id === matchingIngredient.id))
    const matchingRecipeIngredient = matchingRecipe
      .ingredients.find(ingredient => ingredient.id === matchingIngredient.id);
    currentP.innerText = 
    `${matchingIngredient.name}, ${ingredientObj
      .amount} ${matchingRecipeIngredient.quantity.unit}`;
    currentP.classList.add('pantry-ingredient');
  })
}

function applyTags() {
  let uniqueTags = [];
  if (pageViewArr[1]) {
    const tags = recipeRepo.user.getFavoritesByTags(currentFilters);
    uniqueTags = tags.filter((tag, index) => tags.indexOf(tag) === index);
  } else {
    const tags = recipeRepo.matchTags(currentFilters);
    uniqueTags = tags.filter((tag, index) => tags.indexOf(tag) === index);
  }
  generateRecipeCards(uniqueTags, 0);
}


function showFeaturedRecipe (recipeTitle) {
  changeClassName([currentRecipeContainer, currentRecipeTitle], 'vis-hidden');
  changeClassName([myListBtn], 'hidden');
  changeClassName([cookBtn], 'vis-hidden', true);
  changeClassName([removeMyList], 'hidden', true);
  currentRecipeTitle.innerText = recipeTitle;
  const featuredRecipe = currentRecipes.find(recipe => 
    recipe.name === recipeTitle);
  showFeaturedInfo(featuredRecipe);
  if (pageViewArr[2]) {
    checkPantrySupply(featuredRecipe);
  }
}

function checkPantrySupply(recipe) {
  myListBtn.classList.add('hidden');
  removeMyList.classList.remove('hidden');
  if (recipeRepo.user.pantry.isSupplyFor(recipe) === true) {
    cookBtn.classList.remove('vis-hidden')
  } else {
    userMessage.innerText = 
      `You need ${recipeRepo.user.pantry.isSupplyFor(recipe)} to make ${recipe.name}`;
  }
}

function cookRecipe() {
  const currentTitle = currentRecipeTitle.innerText
  const featuredRecipe = currentRecipes.find(recipe => 
    recipe.name === currentTitle);
  recipeRepo.user.pantry.cookFeature(featuredRecipe);
}

function removePlannedRecipe() {
  const currentTitle = currentRecipeTitle.innerText
  const featuredRecipe = currentRecipes.find(recipe => 
    recipe.name === currentTitle);
  const recipeIndex = recipeRepo.user.planned.indexOf(featuredRecipe);
  recipeRepo.user.planned.splice(recipeIndex, 1);
  showPlannedRecipes()
}

function removeFeaturedRecipe() {
  currentRecipeTitle.innerText = "";
  currentRecipeContainer.classList.add('vis-hidden');
  buttonContainer.style.backgroundImage = 'none';
  currentRecipeIngredients.innerHTML = 'Ingredients: ';
  currentRecipeInstructions.innerHTML = '';
}

function showFavorites() {
  generateRecipeCards(recipeRepo.user.favorites, 0);
  pageViewArr[1] = true; pageViewArr[0] = false;
  tagContainer.classList.remove('vis-hidden');
  showFavBtn.classList.add('hidden');
  changeClassName([showFavBtn, prevPageArrow], 'hidden', true)
}

function submitSearch(e) {
  e.preventDefault();
  const searchValue = searchForm.querySelector('.search-field').value;
  searchForm.querySelector('.search-field').value = "";
  if (pageViewArr[1]) {
    determineSearch(searchValue, recipeRepo.user.favorites)
  } else {
    determineSearch(searchValue, recipeRepo.recipes)
  }
}  
  

function clickRecipeCard(e) {
  const currentRecipeCard = e.target.closest('.recipe-card');
  const currentRecipeTitle = currentRecipeCard.querySelector('.recipe-title').innerText;
  if (currentRecipeContainer.classList.contains('vis-hidden')) {
    showFeaturedRecipe(currentRecipeTitle);
  } else {
    removeFeaturedRecipe();
    showFeaturedRecipe(currentRecipeTitle);
  }
}

function favoriteRecipe() {
  const favBtnIndex = (this.id.slice(-1) - 1);
  const favoritedTitle = 
  recipeCards[favBtnIndex].querySelector('.recipe-title').innerText;
  const favoritedRecipe = currentRecipes.find(recipe => recipe.name === favoritedTitle);
  if (recipeRepo.user.favorites.includes(favoritedRecipe)) {
    favBtns[favBtnIndex].labels[0].classList.remove('fav-checked');
    recipeRepo.user.removeFavorite(favoritedRecipe);
  } else {
    favBtns[favBtnIndex].labels[0].classList.add('fav-checked');
    recipeRepo.user.addFavorite(favoritedRecipe);
  }
}

function clickTagFilter(e) {
  const currentTagBtn = e.target.closest('input');
  const currentTagName = currentTagBtn.id.replace('-', ' ')
  if (currentFilters.includes(currentTagName)) {
    currentTagBtn.labels[0].classList.remove('tag-label-checked');
    currentFilters.splice(currentFilters.indexOf(currentTagName));
  } else if (currentTagName) {
    currentFilters.push(currentTagName);
    currentTagBtn.labels[0].classList.add('tag-label-checked');
  }
  applyTags();
}

function showFeaturedInfo(featuredRecipe) {
  currentRecipeImg.src = `${featuredRecipe.image}`;
  userMessage.innerText = ""
  featuredRecipe.instructions.forEach(instruction => {
    currentRecipeInstructions.innerHTML += `<p class="recipe-instruction">
    ${instruction.number}: ${instruction.instruction}</p>`;
  })
  featuredRecipe.getIngredients().forEach(ingredientObj => {
    const currentP = document.createElement('p');
    currentRecipeIngredients.appendChild(currentP);
    currentP.innerText +=
    `${ingredientObj.nameObj.name}:
    ${ingredientObj.quantity.amount.toFixed(2)} ${ingredientObj.quantity.unit}.`;
  })
}

function showNextPage() {
  tagContainer.classList.add('vis-hidden');
  const lastRecipeCard = recipeCards[4];
  const lastRecipeTitle = lastRecipeCard.querySelector('.recipe-title').innerText;
  const lastRecipe = currentRecipes.find(recipe => recipe.name === lastRecipeTitle);
  const nextRecipe = currentRecipes[(currentRecipes.indexOf(lastRecipe)) + 1];
  if (currentRecipes.indexOf(nextRecipe) >= 4) {
    generateRecipeCards(currentRecipes, currentRecipes.indexOf(nextRecipe));
  } else if (currentRecipes.indexOf(nextRecipe) <= 4) {
    generateRecipeCards(currentRecipes, -1, false);
  }
  prevPageArrow.classList.remove('vis-hidden');
}

function showPrevPage() {
  const firstRecipeCard = recipeCards[0];
  const firstRecipeTitle = firstRecipeCard.querySelector('.recipe-title').innerText;
  const firstRecipe = currentRecipes.find(recipe => recipe.name === firstRecipeTitle);
  const firstRecipeIndex = currentRecipes.indexOf(firstRecipe);
  generateRecipeCards(currentRecipes, firstRecipeIndex - 5);
  if (recipeList.querySelector('.recipe-title')
    .innerText === currentRecipes[0].name) {
    tagContainer.classList.remove('vis-hidden');
    prevPageArrow.classList.add('vis-hidden');
  }
}

function generateLimitedCards(recipeArr) {
  recipeArr.forEach(recipe => {
    let currentRecipeCard = recipeCards[recipeArr.indexOf(recipe)];
    createCardContents(currentRecipeCard, recipe, true);
    determineFavorite(currentRecipeCard, recipe.name);
  })
  let cardNumber = recipeArr.length;
  recipeCards.forEach(recipeCard => {
    if (Array.from(recipeCards).indexOf(recipeCard) >= cardNumber) {
      recipeCard.classList.add('vis-hidden');
    }
    nextPageArrow.classList.add('vis-hidden');
  })
}

function generateRecipeCards(newRecipes, iterationCounter) {  
  currentRecipes = newRecipes;
  let iterationCount = iterationCounter;
  if (currentRecipes.length - iterationCount <= recipeCards.length) {
    generateLimitedCards(currentRecipes.slice(iterationCount));
  } else if (currentRecipes.length - iterationCount > 4 && iterationCount > -1) {
    recipeCards.forEach(recipeCard => {
      const currentRecipe = newRecipes[iterationCount];
      iterationCount ++;
      createCardContents(recipeCard, currentRecipe);
    });
  } else {
    nextPageArrow.classList.add('vis-hidden');
  }
}


function createCardContents (cardLi, recipe) {
  if (cardLi) {
    cardLi.querySelector('.recipe-title').innerText = recipe.name;
    cardLi.querySelector('.recipe-img').src = recipe.image;
    randomizeCardColor(cardLi.querySelector('.recipe'));
    cardLi.querySelector('.recipe-cost').innerText = `$${recipe.getCost()}`;
    cardLi.classList.remove('vis-hidden');
    if (determineFavorite(recipe)) {
      cardLi.querySelector('.favorite-label').classList.add('fav-checked');
    } else {
      cardLi.querySelector('.favorite-label').classList.remove('fav-checked');
    }
    if (currentRecipes.length >= recipeCards.length) {
      // nextPageArrow.classList.remove('vis-hidden');
    }
  }
}

function determineSearch(searchValue, searchArray) {
  const matchedName = searchArray.find(recipe => recipe.name.toLowerCase().includes(searchValue.toLowerCase()));
  let ingredientFound = false;
  searchArray.forEach(favorite => {
    const currentIngredients = favorite.getIngredients();
    const found = currentIngredients
      .find(currentIngredient => currentIngredient.nameObj
        .name.toLowerCase().includes(searchValue.toLowerCase()));
    if (found) {
      ingredientFound = found.id;
    }
  });
  if (searchArray === recipeRepo.user.favorites && ingredientFound) {
    searchFavorites(ingredientFound, true)
  } else if (searchArray === recipeRepo.user.favorites && matchedName) {
    searchFavorites(searchValue)
  } else if (matchedName && !ingredientFound) {
    generateRecipeCards(recipeRepo.matchName(searchValue), 0);
  } else if (ingredientFound) {
    generateRecipeCards(recipeRepo.matchIngredient(ingredientFound), 0);
  }
}
