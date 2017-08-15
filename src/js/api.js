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
  $(".card-columns").css("display", "none");
}

function callState() {
  if (authorization.currentUser) {
    //you will need to get the auth token of the user and pass it in as part of the get URL for axios
    authorization.currentUser.getIdToken(true).then(function (idToken) {
      let recipe;
      axios.get('https://project1-4f221.firebaseio.com/usersInfo/' + authorization.currentUser.uid + '/state.json?auth=' + idToken).then((res) => {
        recipe = res.data.directions;
        return axios.get('https://project1-4f221.firebaseio.com/usersInfo/' + authorization.currentUser.uid + '/state/length.json?auth=' + idToken);//same here, you need the auth token
      }).then((res) => {
        let length = res.data;
        showRecipe(recipe, length);
      });
    });
  } else {
    var recentRecipe = JSON.parse(localStorage.getItem('MostRecentRecipe'));
    showRecipe(recentRecipe.directions, recentRecipe.length);
  }
}


function cardsEventApi(){
  $(document).on('click', '#search, #general-search-btn', (e) => {
    console.log("clicked search button");
    e.preventDefault();
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
    } else{
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

function setRecipeInDb(oLikes, myRecipe, array, counter, recipesIWant, htmlString, parentContainer, loadAnimation1){
  myRecipe.ourLikes = oLikes;
  myRecipe.aggregateLikes += myRecipe.ourLikes;
  firebase.database().ref("recipes/" + myRecipe.id).set(myRecipe, function (error) {
    if (error) {
      console.log(error.code);
      recipesIWant.push(myRecipe);
      forceSynchronization(array, (counter + 1), recipesIWant, htmlString, parentContainer, loadAnimation1);
    } else {
      console.log("recipe has been stored in firebase with key: " + myRecipe.id);
      recipesIWant.push(myRecipe);
      let url = myRecipe.sourceUrl ? myRecipe.sourceUrl : 'none';
      let img = myRecipe.image;
      let title = myRecipe.title;
      let servings = myRecipe.servings;
      let time = myRecipe.preparationMinutes;
      let recipeId = myRecipe.id;
      let stars = printStars(myRecipe.spoonacularScore);
      let likes = myRecipe.aggregateLikes;
      htmlString += getCard(title, servings, time, img, url, recipeId, stars, likes);
      forceSynchronization(array, (counter + 1), recipesIWant, htmlString, parentContainer, loadAnimation1);
    }
  });
}

function forceSynchronization(array, counter, recipesIWant, htmlString, parentContainer, loadAnimation1){
  if(counter < array.length){
    var myRecipe = array[counter];
    if(myRecipe.aggregateLikes > 100){
      firebase.database().ref(`recipes/${myRecipe.id}`).once('value', (snap) => {
        if (snap.val()) {
          if (snap.val().ourLikes) {
            setRecipeInDb(snap.val().ourLikes, myRecipe, array, counter, recipesIWant, htmlString, parentContainer, loadAnimation1);
          } else {
            setRecipeInDb(0, myRecipe, array, counter, recipesIWant, htmlString, parentContainer, loadAnimation1);
          }
        } else {
          setRecipeInDb(0, myRecipe, array, counter, recipesIWant, htmlString, parentContainer, loadAnimation1);
        }
      }, function(error){
        console.log(error);
        forceSynchronization(array, (counter + 1), recipesIWant, htmlString, parentContainer, loadAnimation1);
      });
    } else {
      forceSynchronization(array, (counter + 1), recipesIWant, htmlString, parentContainer, loadAnimation1);
    }
  } else {
    //execute end code
    $(parentContainer).css("display", "none");
    loadAnimation1.stopAndRemove();
    if(recipesIWant.length > 0){
      $('.card-columns').css('display', 'block');
      $('.card-columns').html(htmlString);
      setTop50Recipes(recipesIWant);
      recipeEventApi();
    } else {
      $('#no-results').css('display', 'block');
      cardsEventApi();
    }
  }
}


function performCallToGetRecipes(url, config) {
  $('.recipe-container').html("");
  $('.card-columns').html("");

  var parentContainer = document.getElementById("cardsLoadContainer");
  $(parentContainer).css("display", "block");
  var loadAnimation1 = new MyLoadAnimation1(parentContainer,75,12,4,["#b7cb39","#f76f4d"]);

  axios.get(url, config).then((res) => {
    let arr = res.data.results;
    if(arr){
      forceSynchronization(res.data.results, 0, [], '', parentContainer, loadAnimation1);
    }
  }).catch(function(){
    $(parentContainer).css("display", "none");
    loadAnimation1.stopAndRemove();
  }); // end axios.get().then()

  loadAnimation1.startAll();
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


function searchRecipes(url, config) {
  if (!authorization.currentUser) {
    var anonymousSignInPromise = authorization.signInAnonymously();
    anonymousSignInPromise.then(function () {
      performCallToGetRecipes(url, config);
    }).catch(function () {
      console.log("error signing in anonymously to perform search");
    });
  } else {
    performCallToGetRecipes(url, config);
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

function getRecipeWithLocalStorage(url, config) {
  axios.get(url, config)
    .then((res) => {
      let tempState = {};
      let str = res.data.instructions;
      str = str.replace(/[\uE000-\uF8FF]/g, '');
      tempState.length = $(str).find('li').length;
      tempState.directions = str;
      var objectString = JSON.stringify(tempState);
      localStorage.setItem("MostRecentRecipe", objectString);
      localStorage.setItem("Current Page", 'Recipe');
      callState();
    });
};

function getRecipe(url, config, state, recipeId) {
  axios.get(url, config)
    .then((res) => {
      let tempState = {};
      let str = res.data.instructions;
      str = str.replace(/[\uE000-\uF8FF]/g, '');
      tempState.length = $(str).find('li').length;
      tempState.directions = str.trim();
      tempState.currentPage = 'recipe';
      console.log(tempState);
      var recipePath = "recipes/" + recipeId;
      // var objectString = JSON.stringify(tempState);
      // localStorage.setItem("MostRecentRecipe", objectString);
      // var statePath = state.path.ct.join('/');
      // var updates = {};
      // updates[statePath] = tempState;
      // updates[recipePath + "/length"] = tempState.length;
      // updates[recipePath + "/directions"] = tempState.directions;
      // updates[recipePath + "/currentPage"] = tempState.currentPage;
      // console.log(statePath);
      // console.log(updates);
      state.set(tempState).then(function () {
        callState();
      }).catch(function (val) {
        console.log("Error updating database under " + recipePath + " and " + statePath);
      });
    });
};

function likeRecipe(myRecipe) {
  myRecipe.ourLikes += 1;
  return myRecipe;
}

function recipeEventApi() {
  console.log("added heart and my card listeners");
  $('.heart').on('click', function () {
    let id = $(this).attr('heart-id');
    let transactionRef = firebase.database().ref(`recipes/${id}`);
    transactionRef.transaction(function (recipe) {
      if(recipe) {
        recipe = likeRecipe(recipe);
        return recipe;
      } else {
        return recipe;
      }
    });
  });
  $('my-card','#more-instructions').on('click', function () {
      console.log("click my card");
      let sourceUrl = $(this).attr("data-url");
      let myId = $(this).attr("data-recipeId");
      console.log("myId: " + myId);
      let head = {
        headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
      };
      let obj = {
        'forceExtraction': false,
        url: sourceUrl
      };
      let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?`;
      url += $.param(obj);
      if (authorization.currentUser) {
        const state = firebase.database().ref(`usersInfo/${authorization.currentUser.uid}/state/`);
        getRecipe(url, head, state, myId);
      } else {
        getRecipeWithLocalStorage(url,head);
      }
    }
  )
  // $('my-card').on('click', function () {
  //     let sourceUrl = this.url;
  //     let myId = this.recipeId;
  //     console.log("myId: " + myId);
  //     console.log(sourceUrl);
  //     console.log("myId: " + myId);
  //     let head = {
  //       headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
  //     };
  //     let obj = {
  //       'forceExtraction': false,
  //       url: sourceUrl
  //     };
  //     let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?`;
  //     url += $.param(obj);
  //     const state = firebase.database().ref(`usersInfo/${authorization.currentUser.uid}/state`)
  //     getRecipe(url, head, state, myId);
  //     // if (authorization.currentUser) {
  //     //   const state = firebase.database().ref(`usersInfo/${authorization.currentUser.uid}/state/`);
  //     //   getRecipe(url, head, state, myId);
  //     // } else {
  //     //   getRecipeWithLocalStorage(url, head);
  //     // }
  //   }
  // );
}

// Get html element for stars based on spoonacularScore
function printStars(spoonScore){
    let score = {
      fullstars : (function(){
        if (spoonScore%20 >15) {
          return (Math.floor(spoonScore/20)+1)
        } else {
          return Math.floor(spoonScore/20)
        }
      }),
      halfstar : (function(){
          if (spoonScore%20 <= 15 && spoonScore%20 >= 5){
            return 1;
          } else {
            return 0;
          }
        })
   }
   var starsStr = "";
   for (var i=0; i < score.fullstars(); i++) {
      if (score.fullstars() > 0){
        starsStr += "<i class='fa fa-star'></i>&nbsp;"
      }
   };
   if (score.halfstar() > 0) {
    starsStr +=  "<i class='fa fa-star-half'></i>"
   };
   return starsStr;
};

// Delete duplicates while merging arrays
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].id === a[j].id)
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

