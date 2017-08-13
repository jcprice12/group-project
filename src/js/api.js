
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

function showRecipe(recipe,length){
  console.log("recipe html string is:");
  console.log(recipe);
  $('.recipe-container').html(recipe);
  $('.recipeInstructions').addClass('mt-5');
  $('.recipeInstructions ol').addClass('list-group');
  $('.recipeInstructions ol li').addClass('list-group-item list-group-item-info justify-content-between');

  for (let i = 0; i < length; i++) {
    let item = $(`.list-group-item:nth-child(${i + 1})`);
    let inner = item.html();
    item.html('');
    let p = `<p class="mb-0 col-10">${inner}</p>`;
    p += `<span class="badge badge-success badge-pill">${i + 1}</span>`;
    item.html(p);
  }
  $(".card-columns").css("display", "none");
  $(".recipe-container").css("display", "block");
}

function callState() {
  if(authorization.currentUser){
    //you will need to get the auth token of the user and pass it in as part of the get URL for axios
    authorization.currentUser.getIdToken(true).then(function(idToken){
      let recipe;
      axios.get('https://project1-4f221.firebaseio.com/usersInfo/' + authorization.currentUser.uid + '/state.json?auth=' + idToken).then((res) => {
        recipe = res.data.directions;
        return axios.get('https://project1-4f221.firebaseio.com/usersInfo/' + authorization.currentUser.uid + '/state/length.json?auth=' + idToken);//same here, you need the auth token
      }).then((res) => {
        let length = res.data;
        showRecipe(recipe,length);
      });
    });
  } else {
    var recentRecipe = JSON.parse(localStorage.getItem('MostRecentRecipe'));
    showRecipe(recentRecipe.directions, recentRecipe.length);
  }
}

function getCard(title, servings, time, img, url, recipeId) {
  let card = `
    <my-card
      url="${url}"
      source="${img}"
      title="${title}"
      time="${time}"
      servings="${servings}"
      recipeId="${recipeId}"    
    ></my-card>
`;
  return card;
}

function cardsEventApi(){
  $('#search').on('click', (e) => {
    e.preventDefault();
    let search = $('#ingredients').val();
    let excludeIngredients = $('#exclude-ingredients').val();
    let maxCalories = $('#max-calories').val();
    let minCalories = $('#min-calories').val();
    let diet = $(".diet:checked").attr("id");
    let allIntolerances = ""
    $(".intolerance:checked").each(function() {
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
      'intolerances' : allIntolerances,
      'ranking': 1,
      'addRecipeInformation': true
    };

    for(var key in obj) {
      if(obj[key] === "") {
         delete obj[key];
       };
    };

    var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?';
    url += '?' + $.param(obj);
    searchRecipes(url, head);
  });
}

function searchRecipes(url, config) {
  $('.recipe-container').html("");
  $('.card-columns').html("");
  var parentContainer = document.getElementById("cardsLoadContainer");
  $(parentContainer).css("display", "block");
  var loadAnimation1 = new MyLoadAnimation1(parentContainer,75,12,4,["#b7cb39","#f76f4d"]);
  axios.get(url, config)
    .then((res) => {
      let arr = res.data.results;
      let recipes = [];
      let html = '';
      arr.forEach((recipe) => {
        if (recipe.aggregateLikes > 100) {
          if(authorization.currentUser){
            firebase.database().ref("recipes/" + recipe.id).set(recipe, function(error){
              if(error){
                console.log(error.code);
                console.log(error.message);
              } else {
                console.log("recipe has been stored in firebase with key: " + recipe.id);
              }
            });
          }
          let url = recipe.sourceUrl ? recipe.sourceUrl : 'none';
          let img = recipe.image;
          let title = recipe.title;
          let servings = recipe.servings;
          let time = recipe.preparationMinutes;
          let recipeId = recipe.id;
          html += getCard(title, servings, time, img, url, recipeId);
        }
      });
      $(parentContainer).css("display", "none");
      loadAnimation1.stopAndRemove();
      $('.card-columns').html(html);
      $(".card-columns").css("display", "block");
      recipeEventApi();

      var db = firebase.database();
      var top50Ref = db.ref("/top50Recipes");

      var top50Arr = [];
       // Get top 50 array from Firebase
      top50Ref.once("value", function(snap) {
        function getTop50Arr() { 
          if (snap.exists()) {
            top50Arr = snap.val().recipesArray
            return top50Arr;
        } else {
          console.log("I hate Firebase")
          }
        }
        getTop50Arr();
        // Merge arrays, delete duplicates (.unique())
        if (typeof top50Arr !== "undefined"){
          var allRecipes = recipes.concat(top50Arr).unique();
         }

        // Sort recipes high to low
        allRecipes.sort(function(a, b){
          if (a.aggregateLikes > b.aggregateLikes) {
            return -1;
          } else if (a.aggregateLikes < b.aggregateLikes) {
            return 1;
          } else {
            return 0;
          }
        });

        // Trim to only the top 50
        allRecipes = allRecipes.slice(0, 50);
        console.log(allRecipes);

        // Set new top 50 array in Firebase
        top50Ref.transaction(function(current) {
          if (current !== null) {
            current.recipesArray = allRecipes;
            return current;
          } else {
            return 0;
          }
        }); // end transaction

       }); // end top50Ref.once() 
    }); // end axios.get().then()
  loadAnimation1.startAll();
}

function getRecipeWithLocalStorage(url,config){
  axios.get(url, config)
    .then((res) => {
      let tempState = {};
      let str = res.data.instructions;
      str = str.replace(/[\uE000-\uF8FF]/g, '');
      tempState.length = $(str).find('li').length;
      tempState.directions = str;
      var objectString = JSON.stringify(tempState);
      localStorage.setItem("MostRecentRecipe", objectString);
      callState();
    });
}

function getRecipe(url, config, state, recipeId) {

  axios.get(url, config)
    .then((res) => {
      let tempState = {};
      let str = res.data.instructions;
      str = str.replace(/[\uE000-\uF8FF]/g, '');
      tempState.length = $(str).find('li').length;
      tempState.directions = str;

      var recipePath = "recipes/" + recipeId;

      var objectString = JSON.stringify(tempState);
      localStorage.setItem("MostRecentRecipe", objectString);

      var statePath = state.path.ct.join('/');
      var updates = {};
      updates[statePath] = tempState;
      updates[recipePath + "/length"] = tempState.length;
      updates[recipePath + "/directions"] = tempState.directions;

      firebase.database().ref().update(updates).then(function(){
        callState();
      }).catch(function(val){
        console.log("Error updating database under " + recipePath + " and " + statePath);
      });


    });
}

function recipeEventApi() {
  $('my-card').on('click', function () {
      let sourceUrl = this.url;
      let myId = this.recipeId;
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
}

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
  cardsEventApi, passAuth
};

