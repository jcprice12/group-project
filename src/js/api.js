import firebase from 'firebase';
import axios from 'axios';

var config = {
  apiKey: "AIzaSyAo2GM4PjdcCsGq-3detGaqYkG-C6r_4iw",
  authDomain: "project1-4f221.firebaseapp.com",
  databaseURL: "https://project1-4f221.firebaseio.com/",
  projectId: "project1-4f221",
  storageBucket: "project1-4f221.appspot.com",
  messagingSenderId: "364363031540"
};
firebase.initializeApp(config);
const authorization = firebase.auth();
const wholeDb = firebase.database();
const db = firebase.database().ref('/recipes');
const state = firebase.database().ref('/state');

function getCard(title, servings, img, time, source) {
  let card = `<div id="${source}" class="card card-recipe">
            <img class="card-img-top img-fluid"
                 src="${img}"
                 alt="Card image cap"
                 style="width: 100%">
            <div class="card-block">
              <h4 class="card-title">${title}</h4>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star-half"></i>
            </div>
            <div class="card-footer">
              <div class="footer-icons d-flex flex-row justify-content-start">
                <div class="card-cooktime mr-3 mr-sm-1 ">
                  <i class="fa fa-clock-o"></i>
                  <span class="icon-text"><small>${time} m</small></span>
                </div>
                <div class="card-yield mr-3 mr-sm-1 ">
                  <i class="fa fa-pie-chart"></i>
                  <span class="icon-text"><small>${servings} servings</small></span>
                </div>
              </div>
            </div>
          </div>`;
  return card;
}

function cardsEventApi(){
  $('#search-btn').on('click', (e) => {
    e.preventDefault();
    let search = $('#search-recipe').val();
    var head = {
      headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
    };
    var obj = {
      'limitLicence': false,
      'number': 100,
      'query': search,
      'ranking': 1,
      'addRecipeInformation': true
    };
    var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?';
    url += '?' + $.param(obj);
    searchRecipes(url,head);
  });
}

function searchRecipes(url, config) {
  axios.get(url, config)
    .then((res) => {
      let arr = res.data.results;
      let recipes = [];
      let html = '';
      arr.forEach((recipe) => {
        if(recipe.aggregateLikes > 100){
          console.log(recipe);
          let source = recipe.sourceUrl ? recipe.sourceUrl : 'none';
          let img = recipe.image;
          let title = recipe.title;
          let servings = recipe.servings;
          let time = recipe.preparationMinutes;
          html += getCard(title, servings, img, time, source);
        }
      });
      $('.card-columns').html(html);
      recipeEventApi();
    });
}

function getRecipe(url, config) {
  axios.get(url, config)
    .then((res) => {
      let tempState = {};
      let str = res.data.instructions;
      str = str.replace(/[\uE000-\uF8FF]/g, '');
      console.log($(str).find('li').length);
      console.log(str);
      tempState.length = $(str).find('li').length;
      tempState.directions = str;
      state.set(tempState);
      window.location = "/recipe.html";
    });
}

function recipeEventApi(){
  $('.card-recipe').on('click', function() {
    let sourceUrl = $(this).attr('id');
    let head = {
      headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
    };
    let obj = {
      'forceExtraction': false,
      url: sourceUrl
    };
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?`;
    url += '?' + $.param(obj);
    getRecipe(url,head);
  })
}



module.exports = {
  cardsEventApi,
  db,
  wholeDb,
  authorization,
};

