import axios from 'axios';
import {MyLoadAnimation1} from './MyLoadAnimation1.js';

var authorization;
var parentContainer = document.getElementById("cardsLoadContainer");
var loadAnimation1 = new MyLoadAnimation1(parentContainer,75,12,4,["#b7cb39","#f76f4d"]);

/***** Collapse Animation ********/
$(".collapse-menu").on("click", function () {
  if ($(this).find(".plus-minus").text() === "(-)") {
    $(this).find(".plus-minus").text("(+)")
  }
  else {
    $(this).find(".plus-minus").text("(-)");
  }
});

function passAuth(myAuth) {
  authorization = myAuth;
}


function populateLi(start, length, col) {
  let parent = $(`.recipeInstructions .col:nth-child(${col})`);
  for (let i = start; i < length; i++) {
    let item = $(`.item-${i}`);
    let inner = item.html();
    item.html('');
    let p = `<p class="mb-0 pl-0 pr-0 col-11" style="color: #282828; font-weight: 300">${inner}</p>`;
    let s = `<div id="step-${i + 1}" 
                class="overlay mr-3 d-flex align-items-center align-self-start justify-content-center" 
                style="min-height: 40px; min-width: 40px;max-height: 40px; max-width: 40px; border: 0.5px solid lightcoral; border-radius: 50%;">
              <p style="line-height: 40px; color: gray; font-size: 20px; font-weight: 300; margin-bottom: 1.5px;">
              ${i + 1}</p>
            </div>`;
    p = s + p;
    item.html(p);
    parent.append(item);
  }
}

function showRecipe(recipe, length, ingredients) {
  console.log("recipe html string is:");
  console.log(recipe);
  $("#recipe-container").css("display", "block").html(recipe);
  $('.recipeInstructions').addClass('mt-5');
  $('.recipeInstructions ol').addClass('d-flex pl-0 justify-content-between');
  for(var i=0;i<length;i++){
    $(`.recipeInstructions ol li:nth-child(${i+1})`)
    .addClass(`justify-content-between border-0 list-group-item list-group-item procedures item-${i}`).css('flex-flow', 'row');
  }
  $('.recipeInstructions ol').prepend(`<li class="col list-group pl-0 pr-0"></li>`);
  console.log({arr1: [0, Math.ceil((length/2) - 1), 1], arr2: [Math.ceil((length/2) - 1), length, 2]});
  populateLi(0,length, 1);
  $('.recipeInstructions').prepend(`
          <div class="card-block pb-0" 
              style=" background-color: white;"><h2 
              style="border-bottom: 0.5px solid #B7CB39; color: black; font-weight: 300;" class="mb-0 pb-3">Directions
          </h2></div>`);
  let ingredientsHtml;
  if(ingredients.length > 6) {
    ingredientsHtml = `<ul class="col list-group">${ingredients.slice(0,Math.ceil(ingredients.length/2)).join('')}</ul>`;
    ingredientsHtml +=  `<ul class="col list-group">${ingredients.slice(Math.ceil(ingredients.length/2),ingredients.length).join('')}</ul>`;
    ingredientsHtml = `
              <div class="card-block mt-5 pb-0" 
              style=" background-color: white;"><h2 
              style="border-bottom: 0.5px solid #B7CB39;color: black; font-weight: 300;" class="mb-0 pb-3">Ingredients
              </h2></div>
                  <div class="d-flex pl-0 flex-row justify-content-between hidden-md-down" style="background-color: 
                  white;">
                  ${ingredientsHtml}
                  </div>
            `;
    ingredientsHtml += `<ul class="col list-group hidden-lg-up pl-0 pr-0">${ingredients.slice(0, ingredients.length).join('')}</ul>\``
    $('.recipe-container').prepend(ingredientsHtml);
  } else {
    $('.recipe-container').prepend(`
            <div class="card-block mt-5 pb-0" 
              style=" background-color: white;"><h2 
              style="border-bottom: 0.5px solid #B7CB39;color: black; font-weight: 300;" class="mb-0 pb-3">Ingredients
              </h2>
            </div>
            <ul class="mb-5 col list-group pl-0 pr-0">${ingredients.join('')}</ul>`);
  }
}

function getRecipe(url, config, recipeId) {
  axios.get(url, config)
    .then((res) => {
      let str = res.data.instructions;
      str = str.replace(/[\uE000-\uF8FF]/g, '');
      let length = $(str).find('li').length;
      let directions = str.trim();
      var recipePath = "recipes/" + recipeId;
      console.log(directions);
      console.log(length);
      let ingredients = res.data.extendedIngredients;
      let html = '';
      let ingredientsArr = [];
      ingredients.forEach(({originalString}, i) => {
        ingredientsArr.push(
          `<li class="justify-content-between list-group-item border-0" style="flex-flow: row !important;">
              <div id="step-${i + 1}" 
                class="overlay mr-4 d-flex align-items-center align-self-start justify-content-center" 
                style="min-height: 40px; min-width: 40px;max-height: 40px; max-width: 40px; border: 0.5px solid lightcoral; border-radius: 50%;">
              <p style="line-height: 40px; color: gray; font-size: 20px; font-weight: 300; margin-bottom: 1.5px;">
              ${i + 1}</p>
              </div>
              <p class="mb-0 col-11 pl-0 pr-0" style="color: #282828; font-weight: 300">${originalString}</p>
          </li>`)
      });
      showRecipe(directions, length, ingredientsArr);
    });
}

function cardsEventApi() {
  $('#search, #general-search-btn').click((e) => {
    $('#no-results').css('display', 'none');
    $('.nav-form').removeClass('show').attr('aria-expanded', 'false');
    e.preventDefault();
    if($('#general-search').val() === "" && $('#ingredients').val()===""){
      $("#query-error").css("display", "block");
      cardsEventApi();
    } else {
      let search = '';
      if (typeof $('#general-search').val() !== 'undefined' && $('#general-search').val() !== "") {
        search = $('#general-search').val();
      } else {
        search = $('#ingredients').val();
      };

      let ingredients = $('#ingredients').val();
      let excludeIngredients = $('#exclude-ingredients').val();
      let maxCalories = $('#max-calories').val();
      let minCalories = $('#min-calories').val();
      if (maxCalories < minCalories) {
        $("#calories-error").css("display", "block");
        cardsEventApi();
      } else {
        $("#search-message, .home, #calories-error").css("display", "none");
        $('.card-columns').css('display', 'block');
        $('#recipe-container').css('display', 'none');
        $('.card-columns').empty();
        let diet = $(".diet:checked").attr("id");
        let allIntolerances = "";
        $(".intolerance:checked").each(function () {
          allIntolerances += ($(this).attr("id") + " ");
        });
        allIntolerances = allIntolerances.trim();

        var head = {
          headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
        };
        var obj = {
          'limitLicence': false,
          'number': 300,
          'query': search,
          'ingredients': ingredients,
          'excludeIngredients': excludeIngredients,
          'maxCalories': maxCalories,
          'minCalories': minCalories,
          'diet': diet,
          'intolerances': allIntolerances,
          'ranking': 1,
          'addRecipeInformation': true
        };
        displaySearchMessage(obj);
        for (var key in obj) {
          if (obj[key] === "") {
            delete obj[key];
          }
        }
        var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?';
        url += '?' + $.param(obj);
        searchRecipes(url, head);
      }
    }
  });
}

function getGoodTop50(top50Arr, recipes){
  // Merge arrays, delete duplicates (.unique())
  var allRecipes = [];
  if (typeof top50Arr !== "undefined") {
    allRecipes = recipes.concat(top50Arr).unique();
  }
  // Sort recipes high to low
  allRecipes.sort(function (a, b) {
    if (a.aggregateLikes > b.aggregateLikes) {
      return -1;
    } else if (a.aggregateLikes < b.aggregateLikes) {
      return 1;
    } else {
      return 0;
    };
  });
  // Trim to only the top 50
  allRecipes = allRecipes.slice(0, 50);
  console.log(allRecipes);

  return allRecipes;
}

function setTop50Recipes(recipes) {

  var db = firebase.database();
  var top50Ref = db.ref("/top50Recipes");

  var top50Arr = [];
  // Get top 50 array from Firebase
  top50Ref.once("value", function (snap) {
    if (snap.exists()) {
      top50Arr = snap.val().recipesArray;

      var allRecipes = getGoodTop50(top50Arr, recipes);

      top50Ref.transaction(function (current) {
        if (current !== null) {
          current.recipesArray = allRecipes;
          return current;
        } else {
          current = {recipesArray: allRecipes};
          return current;
        }
      }); // end transaction

    } else {
      console.log("Snapshot doesn't exist");

      var allRecipes = getGoodTop50([], recipes);

      top50Ref.transaction(function (current) {
        if (current !== null) {
          current.recipesArray = allRecipes;
          return current;
        } else {
          current = {recipesArray: allRecipes};
          return current;
        }
      }); // end transaction
    }

  }, function (error) {
    console.log(error.code);
  }); // end top50Ref.once()
}

function displaySearchMessage(obj){
  var searchText = ("Search: " + obj.query);
  if (obj.query !== obj.ingredients && obj.ingredients !== "") {
    searchText += ("; Ingredients: " + obj.ingredients);
  }
  if (obj.excludeIngredients !== "") {
    searchText += ("; exclude ingredients: " + obj.excludeIngredients)
  }
  if (obj.maxCalories !== "") {
    searchText += ("; max. calories: " + obj.maxCalories)
  }
  if (obj.minCalories !== "") {
    searchText += ("; min. calories: " + obj.minCalories)
  }
  if (obj.diet !== "" && (typeof obj.diet !== 'undefined')) {
    searchText += ("; special diet: " + obj.diet)
  }
  if (obj.intolerances !== "") {
    searchText += ("; dietary restrictions: " + obj.intolerances)
  }
  $("#search-message").html(searchText).css("display", "block");
};

function setRecipeInDb(recipes) {
  console.log(recipes);
  let arr = [];
  if(typeof recipes[0] == 'undefined'){
    loadAnimation1.stopAndRemove();
    $('#no-results').css('display', 'block');
    return;
  }

  recipes.forEach((recipe) => {
    firebase.database().ref(`recipes/${recipe.id}`).once('value', (snap) => {
      if (snap.val()) {
        // if (snap.val().ourLikes)
        recipe.ourLikes = snap.val().ourLikes;
        recipe.aggregateLikes += recipe.ourLikes;
        firebase.database().ref("recipes/" + recipe.id).set(recipe, function (error) {
          if (error) {
            console.log(error.code);
            console.log(error.message);
          } else {
            console.log("recipe has been stored in firebase with key: " + recipe.id);
          }
        }).then(() => {
          arr.push(axios.get(`https://project1-4f221.firebaseio.com/recipes/${recipe.id}.json`));
          console.log(arr);
          if (arr.length >= recipes.length) {
            Promise.all((arr)).then((result) => {
              finalize(result);
            })
          }
        });
        // }
      } else {
        recipe.ourLikes = 0;
        firebase.database().ref("recipes/" + recipe.id).set(recipe, function (error) {
          if (error) {
            console.log(error.code);
            console.log(error.message);
          } else {
            console.log("recipe has been stored in firebase with key: " + recipe.id);
            console.log('hello3');
          }
        }).then(() => {
          arr.push(axios.get(`https://project1-4f221.firebaseio.com/recipes/${recipe.id}.json`))
          console.log(arr);
          if (arr.length >= recipes.length) {
            Promise.all((arr)).then((result) => {
              finalize(result);
            })
          }
        });
      }
    });
  });
}

function finalize(result) {
  let html = '';
  var recipes = [];
  result.forEach((recipe) => {
    console.log(recipe.data);
    if (recipe.data.aggregateLikes > 100) {
      recipes.push(recipe.data);
      let url = recipe.data.sourceUrl ? recipe.data.sourceUrl : 'none';
      let img = recipe.data.image;
      let title = recipe.data.title;
      let servings = recipe.data.servings;
      let time = recipe.data.readyInMinutes ? recipe.data.readyInMinutes + ' m' : 'N/A';
      let recipeId = recipe.data.id;
      let stars = printStars(recipe.data.spoonacularScore);
      let likes = recipe.data.aggregateLikes;
      html += getCard(title, servings, time, img, url, recipeId, stars, likes);
    }
  });
  $(parentContainer).css("display", "none");
  loadAnimation1.stopAndRemove();
  $('.card-columns').html(html);
  recipeEventApi();
  setTop50Recipes(recipes);
}

function performCallToGetRecipes(url, config) {
  $(parentContainer).css("display", "block");
  loadAnimation1.startAll();
  return axios.get(url, config)
    .then((res) => {
      let arr = res.data.results;
      return arr;
    }).catch(function(){
      $(parentContainer).css("display", "none");
      loadAnimation1.stopAndRemove();
    }); // end axios
}

function searchRecipes(url, config) {
  if (!authorization.currentUser) {
    var anonymousSignInPromise = authorization.signInAnonymously();
    anonymousSignInPromise.then(function () {
      performCallToGetRecipes(url, config).then((res) => {
        setRecipeInDb(res);
        console.log(res);
      });
    }).catch(function () {
      console.log("error signing in anonymously to perform search");
    });
  } else {
    performCallToGetRecipes(url, config).then((res) => {
      setRecipeInDb(res);
    })
  }
};

function getCard(title, servings, time, img, url, recipeId, stars, likes) {
  let card = `
    <my-card
      url="${url}"
      data-url="${url}"
      source="${img}"
      title="${title}"
      time="${time}"
      servings="${servings}"
      recipeId="${recipeId}" 
      data-recipeId="${recipeId}"
      likes="${likes}"   
      stars="${stars}"   
    ></my-card>
`;
  return card;
}


//

function likeRecipe(myRecipe) {
  myRecipe.ourLikes += 1;
  return myRecipe;
}

var amLiking = false;
function recipeEventApi() {
  $("#nav-brand").click(function(){
    $('#no-results').css('display', 'none');
    $(".home").css("display", "block");
    $("#search-message, #no-results, #recipe-container, .recipeInstructions, .card-columns, #calories-error, #query-error").css("display", "none");
    $("form").trigger("reset");
    $("#collapseExample").removeClass("show");
  });

  $('.heart').on('click', function () {
    let id = $(this).attr('heart-id');
    if(!amLiking){
      amLiking = true;
      if(authorization.currentUser){
        if(!authorization.currentUser.isAnonymous){
          firebase.database().ref("userRecipes/" + authorization.currentUser.uid).once("value", function(snap){
            if(!snap.hasChild(id)){
              firebase.database().ref("userRecipes/" + authorization.currentUser.uid + "/" + id).set(true, function(error){
                amLiking = false;
                if(error){
                  console.log(error.code);
                } else {
                  let transactionRef = firebase.database().ref(`recipes/${id}`);
                  transactionRef.transaction(function (recipe) {
                    if(recipe) {
                      recipe = likeRecipe(recipe);
                      return recipe;
                    } else {
                      return recipe;
                    }
                  });
                }
              });
            } else {
              amLiking = false;
            }
          }, function(error){
            amLiking = false;
            console.log(error.code);
          });
        } else {
          amLiking = false;
        }
      } else {
        amLiking = false;
      }
    }
  });
  $(document).on('click', '#more-instructions', function () {
    $('.card-columns').css('display', 'none');
      console.log('click');
      let sourceUrl = $(this).attr('data-url');
      let myId = $(this).attr("data-recipeId");
      console.log("myId: " + myId);
      console.log(sourceUrl);
      let head = {
        headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
      };
      let obj = {
        'forceExtraction': false,
        url: sourceUrl
      };
      let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?`;
      url += $.param(obj);
      getRecipe(url, head, myId);
    });

  $('my-card').on('click', '.recipe-footer, .recipe-img, .recipe-block', function () {
    $('.card-columns').css('display', 'none');
      console.log('click');
      let sourceUrl = $(this).attr('source-url');
      let myId = $(this).attr("data-recipeId");
      console.log("myId: " + myId);
      console.log(sourceUrl);
      let head = {
        headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
      };
      let obj = {
        'forceExtraction': false,
        url: sourceUrl
      };
      let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?`;
      url += $.param(obj);
      getRecipe(url, head, myId);
    });
}

// Get html element for stars based on spoonacularScore
function printStars(spoonScore) {
  let score = {
    fullstars: (function () {
      if (spoonScore % 20 > 15) {
        return (Math.floor(spoonScore / 20) + 1)
      } else {
        return Math.floor(spoonScore / 20)
      }
    }),
    halfstar: (function () {
      if (spoonScore % 20 <= 15 && spoonScore % 20 >= 5) {
        return 1;
      } else {
        return 0;
      }
    })
  };

  var starsStr = "";
  for (var i = 0; i < score.fullstars(); i++) {
    if (score.fullstars() > 0) {
      starsStr += "<i class='fa fa-star'></i>&nbsp;"
    }
  }
  ;
  if (score.halfstar() > 0) {
    starsStr += "<i class='fa fa-star-half'></i>"
  }
  ;
  return starsStr;
};

// Delete duplicates while merging arrays
Array.prototype.unique = function () {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i].id === a[j].id)
        a.splice(j--, 1);
    }
  }
  return a;
};

module.exports = {
  cardsEventApi,
  passAuth,
  recipeEventApi,
  getCard,
  printStars
};

