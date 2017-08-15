import axios from 'axios';
import {MyLoadAnimation1} from './MyLoadAnimation1.js';

var authorization;

/***** Collapse Animation ********/
$(".collapse-menu").on("click", function(){
  if ($(this).find(".plus-minus").text() === "(-)") {
    $(this).find(".plus-minus").text("(+)")
  }
  else{
    $(this).find(".plus-minus").text("(-)");
  }
});

function passAuth(myAuth) {
  authorization = myAuth;
}

function showRecipe(recipe, length) {
  console.log("recipe html string is:");
  console.log(recipe);
  $("#recipe-container").css("display", "block").html(recipe);
  $('.recipeInstructions').addClass('mt-5');
  $('.recipeInstructions ol').addClass('list-group');
  $('.recipeInstructions ol li').addClass('list-group-item list-group-item-info justify-content-between');
  for (let i = 0; i < length; i++) {
    let item = $(`.recipeInstructions .list-group-item:nth-child(${i + 1})`);
    let inner = item.html();
    item.html('');
    let p = `<p class="mb-0 col-10">${inner}</p>`;
    p += `<span class="badge badge-success badge-pill">${i + 1}</span>`;
    item.html(p);
  }
}

//


function cardsEventApi(){
  $('#search, #general-search-btn').click( (e) => {
    e.preventDefault();
    $('.card-columns').css('display', 'block');
    $('#recipe-container').css('display', 'none');
    $('.card-columns').empty();
    let search = '';
    if (typeof $('#general-search').val() !== 'undefined' && $('#general-search').val() !== "") {
      search = $('#general-search').val();
    } else {
      search = $('#ingredients').val();
    };
    let excludeIngredients = $('#exclude-ingredients').val();
    let maxCalories = $('#max-calories').val();
    let minCalories = $('#min-calories').val();
    if (maxCalories < minCalories) {
      $("#calories-error").css("display", "block");
      cardsEventApi();
    } else {
      $("#calories-error").css("display", "none");
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
        'ingredients': search,
        'excludeIngredients': excludeIngredients,
        'maxCalories': maxCalories,
        'minCalories': minCalories,
        'diet': diet,
        'intolerances': allIntolerances,
        'ranking': 1,
        'addRecipeInformation': true
      };
      for (var key in obj) {
        if (obj[key] === "") {
          delete obj[key];
        }
      }
      var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?';
      url += '?' + $.param(obj);
      searchRecipes(url, head);
    }
  });
}

function setTop50Recipes(recipes) {
  var db = firebase.database();
  var top50Ref = db.ref("/top50Recipes");

  var top50Arr = [];
  // Get top 50 array from Firebase
  top50Ref.once("value", function (snap) {
    if (snap.exists()) {
      top50Arr = snap.val().recipesArray;
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
    }

  }, function (error) {
    console.log(error.code);
  }); // end top50Ref.once()
}

let promises = [];

function setRecipeInDb(recipes) {
  console.log(recipes);
  let arr = [];
  recipes.forEach((recipe, i) => {
    firebase.database().ref(`recipes/${recipe.id}`).once('value', (snap) => {
      if (snap.val()) {
        // if (snap.val().ourLikes) {
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
            if(arr.length >= recipes.length ){
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
          if(arr.length >= recipes.length ){
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
  result.forEach((recipe) => {
    console.log(recipe.data);
    if (recipe.data.aggregateLikes > 100) {
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
  $('.card-columns').html(html);
  recipeEventApi();
}

function performCallToGetRecipes(url, config) {
  return axios.get(url, config)
    .then((res) => {
      let arr = res.data.results;
      return arr;
    }); // end axios.get().the
}
function searchRecipes(url, config) {
  if (!authorization.currentUser) {
    var anonymousSignInPromise = authorization.signInAnonymously();
    anonymousSignInPromise.then(function () {
      performCallToGetRecipes(url, config).then((res) => {
        console.log(res);
      });
    }).catch(function () {
      console.log("error signing in anonymously to perform search");
    });
  } else {
    performCallToGetRecipes(url, config).then((res) => {
      setRecipeInDb(res);
    })
  //     .then((arr) => {
  //     Promise.all(arr).then((resolvedPromises) => {
  //       let html = '';
  //       let recipes = [];
  //       console.log(resolvedPromises);

  //       return html;
  //     }).then((res) => {
  //       console.log(res);
  //       if (typeof arr[0] === 'undefined') {
  //         $('#no-results').css('display', 'block');
  //         cardsEventApi();
  //       } else {
  //         // $('#no-results').css('display', 'none');
  //         $('.card-columns').html(res);
  //         recipeEventApi();
  //         // setTop50Recipes(recipes);
  //       }
  //     });
  //   });
  }
};

function getCard(title, servings, time, img, url, recipeId, stars, likes) {
  let card = `
    <my-card
      url="${url}"
      source="${img}"
      title="${title}"
      time="${time}"
      servings="${servings}"
      recipeId="${recipeId}" 
      likes="${likes}"   
      stars="${stars}"   
    ></my-card>
`;
  return card;
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
      showRecipe(directions, length);
    });
}

//

function likeRecipe(myRecipe) {
  myRecipe.ourLikes += 1;
  return myRecipe;
}


function recipeEventApi() {
  $('.heart').on('click', function () {
    let id = $(this).attr('heart-id');
    console.log(id);
    let transactionRef = firebase.database().ref(`recipes/${id}`);
    transactionRef.transaction(function (recipe) {
      if (recipe) {
        recipe = likeRecipe(recipe);
        return recipe;
      } else {
        return recipe;
      }
    });
  });
  $('my-card').on('click', '.recipe-footer, .recipe-img, .recipe-block, #more-instructions', function () {
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
    }
  )
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
  };
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

