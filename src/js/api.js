
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

function callState() {
  //you will need to get the auth token of the user and pass it in as part of the get URL for axios
  authorization.currentUser.getIdToken(true).then(function(idToken){
    axios.get('https://project1-4f221.firebaseio.com/usersInfo/' + authorization.currentUser.uid + '/state.json?auth=' + idToken).then((res) => {
      let recipe = res.data.directions;
      console.log(recipe);
      $('.recipe-container').html(recipe);
      $('.recipeInstructions').addClass('mt-5');
      $('.recipeInstructions ol').addClass('list-group');
      $('.recipeInstructions ol li').addClass('list-group-item list-group-item-info justify-content-between');
      return axios.get('https://project1-4f221.firebaseio.com/usersInfo/' + authorization.currentUser.uid + '/state/length.json?auth=' + idToken);//same here, you need the auth token
    }).then((res) => {
      let length = res.data;
      console.log(res);
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
    });
  });
}

function getCard(title, servings, time, img, url) {
  let card = `
    <my-card
      url="${url}"
      source="${img}"
      title="${title}"
      time="${time}"
      servings="${servings}"    
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
  $('.card-columns').html("");
  var parentContainer = document.getElementById("cardsLoadContainer");
  $(parentContainer).css("display", "block");
  var loadAnimation1 = new MyLoadAnimation1(parentContainer,75,12,4,["#2ECC71","#fdcb4e","#ff6876","#666ffd"]);
  axios.get(url, config)
    .then((res) => {
      let arr = res.data.results;
      let recipes = [];
      let html = '';
      arr.forEach((recipe) => {
        if (recipe.aggregateLikes > 100) {
          console.log(recipe);
          let url = recipe.sourceUrl ? recipe.sourceUrl : 'none';
          let img = recipe.image;
          let title = recipe.title;
          let servings = recipe.servings;
          let time = recipe.preparationMinutes;
          html += getCard(title, servings, time, img, url);
        }
      });
      $(parentContainer).css("display", "none");
      loadAnimation1.stopAndRemove();
      $('.card-columns').html(html);
      $(".card-columns").css("display", "block");
      recipeEventApi();
    });
  loadAnimation1.startAll();
}

function getRecipe(url, config, state) {
  axios.get(url, config)
    .then((res) => {
      let tempState = {};
      let str = res.data.instructions;
      str = str.replace(/[\uE000-\uF8FF]/g, '');
      console.log($(str).find('li').length);
      console.log(str);
      tempState.length = $(str).find('li').length;
      tempState.directions = str;
      state.set(tempState, function(error){
        if(error){
          console.log(error.code);
        } else {
          callState();
        }
      });
    });
}

function recipeEventApi() {
  $('my-card').on('click', function () {
      if (authorization.currentUser) {
        const state = firebase.database().ref(`usersInfo/${authorization.currentUser.uid}/state/`);
        let sourceUrl = this.url;
        let head = {
          headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
        };
        let obj = {
          'forceExtraction': false,
          url: sourceUrl
        };
        let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?`;
        url += $.param(obj);
        getRecipe(url, head, state);
      }
    }
  )
}

module.exports = {
  cardsEventApi, passAuth
};

