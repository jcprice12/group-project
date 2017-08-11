//const firebase = require('firebase');

import '../css/style.scss';
import 'jquery';
import 'tether'
import 'bootstrap';
import axios from 'axios';
//import eventApi function from './api.js' file
import {cardsEventApi} from './api.js';
import {signIn, signUp, signOut, authStateChanged} from './userAuth.js';

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


// 
function callState() {
  axios.get('https://project1-4f221.firebaseio.com/state.json')
    .then((res) => {
      let recipe = res.data.directions;
      console.log(recipe);
      $('.recipe-container').html(recipe);
      $('.recipeInstructions').addClass('mt-5');
      $('.recipeInstructions ol').addClass('list-group');
      $('.recipeInstructions ol li').addClass('list-group-item list-group-item-info justify-content-between');
      return axios.get('https://project1-4f221.firebaseio.com/state/length.json')
    })
    .then((res) => {
      let length = res.data;
      console.log(res);
      for (let i = 0; i < length; i++) {
        let inner = $(`.list-group-item:nth-child(${i + 1})`).html();
        $(`.list-group-item:nth-child(${i + 1})`).html('');
        let p = `<p class="mb-0 col-10">${inner}</p>`;
        p += `<span class="badge badge-success badge-pill">${i + 1}</span>`;
        $(`.list-group-item:nth-child(${i + 1})`).html(p);
      }
    })
}

//initialize page
function init() {
  if (window.location.pathname == '/dashboard.html') {
    signUp(authorization);
    signIn(authorization);
    signOut(authorization);
    authStateChanged(authorization,wholeDb);
    authStateChanged(authorization,wholeDb);
  } else if (window.location.pathname == '/recipe.html') {
    console.log(`You're in the ${window.location.pathname}`);
    signUp(authorization);
    signIn(authorization);
    signOut(authorization);
    authStateChanged(authorization,wholeDb);
    callState();
  } else {
    cardsEventApi();
    signUp(authorization);
    signIn(authorization);
    signOut(authorization);
    authStateChanged(authorization,wholeDb);
  }
}

init();

module.exports = {
  db,
  wholeDb,
  authorization,
};
