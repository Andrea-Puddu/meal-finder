"use strict";

const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const resultHeading = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const single_mealEl = document.getElementById("single-meal");

//////////////////////////////
// FUNCTIONS
// Search meal and fetch for API https://www.themealdb.com/api.php
const searchMeal = function (e) {
  e.preventDefault();

  // clear single meal
  single_mealEl.innerHTML = "";

  // get the search term
  const term = search.value.trim();

  // check for empty
  // www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
  if (term) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.meals);

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          resultHeading.innerHTML = `<h2>Search result for "${term}":</h2>`;
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join("");
        }
      });

    // clear search text
    search.value = "";
  } else {
    alert("Please enter a search term 🤔");
  }
};

// Fetch Meal by ID
const getMealById = function (mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}
  `)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const meal = data.meals[0];
      console.log(meal);

      addMealToDOM(meal);
    });
};

// Fetch random meal from API
const getRandomMeal = function () {
  // clear meals and heading
  resultHeading.innerHTML = "";
  mealsEl.innerHTML = "";
  single_mealEl.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
};

// Add meal to DOM
const addMealToDOM = function (meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  // console.log(ingredients);

  single_mealEl.innerHTML = `
    <h1>${meal.strMeal}</h1>

    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />

    <div class="single-meal-info">
        ${meal.strCategory ? `<span>${meal.strCategory}</span>` : ""}
        ${meal.strArea ? `<span>${meal.strArea}</span>` : ""}
    </div>

    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
    </div>
  
  
  
  `;
};

//////////////////////////////
// EVENT LISTENERS
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", function (e) {
  const mealInfo = e.target.closest(".meal-info");
  if (!mealInfo) return;
  const mealId = mealInfo.dataset.mealid;
  getMealById(mealId);
});
