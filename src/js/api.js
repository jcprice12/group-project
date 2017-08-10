const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyAo2GM4PjdcCsGq-3detGaqYkG-C6r_4iw",
  authDomain: "project1-4f221.firebaseapp.com",
  databaseURL: "https://project1-4f221.firebaseio.com/",
  projectId: "project1-4f221",
  storageBucket: "project1-4f221.appspot.com",
  messagingSenderId: "364363031540"
};
firebase.initializeApp(config);

const db = firebase.database().ref('/recipes');
db.once('value')
  .then((snap) => {
    console.log(snap);
  });

$.get('https://project1-4f221.firebaseio.com/recipes/recipeKey/recipe.json', (res) => {
  for(var item in res){
    console.log(res[item]);
  }
});

function getCard(title, cals, servings, img) {
  let card = `<div class="card card-recipe">
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
                <div class="card-calories mr-3 mr-sm-1 ">
                  <i class="fa fa-bar-chart-o"></i>
                  <span class="icon-text"><small>${cals} cals</small></span>
                </div>
                <div class="card-cooktime mr-3 mr-sm-1 ">
                  <i class="fa fa-clock-o"></i>
                  <span class="icon-text"><small>45 m</small></span>
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

function getRecipes(url) {
  $.get(url, (res) => {
    console.log(res);
    let html = '';
    res.hits.forEach(({recipe}) => {
      console.log(recipe.calories);
      let title = recipe.label;
      let servings = recipe.yield;
      let cals = Math.floor(recipe.calories / servings);
      let img = recipe.image;
      html += getCard(title, cals, servings, img);
    });
    $('.card-columns').html(html);
  })
}

function eventApi(){
  $('#search-btn').on('click', (e) => {
    e.preventDefault();
    let search = $('#search-recipe').val();
    let url = `https://api.edamam.com/search?q=${search}&app_id=87b25c20&app_key=2c3c60c276ca6dfd0780517fe3244719`;
    getRecipes(url);
  });
}

module.exports = {
  eventApi
};

