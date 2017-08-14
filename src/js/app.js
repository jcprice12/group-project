import '../css/style.scss';
import 'jquery';
import 'tether';
import 'bootstrap';
import axios from 'axios';

import {cardsEventApi, passAuth} from './api.js';
import {signIn, signUp, signOut, authStateChanged} from './userAuth.js';
// import {initMap} from './googleMaps.js';
import {getMyRecipes} from './browseMyRecipes.js';

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
axios.get('https://project1-4f221.firebaseio.com/recipes.json').then((res) => {
  let obj = {};
  obj = res.data;
  let count = 0;
  for (var key in obj) {
    count++
  }
  console.log(count);
  // let obj = {...res.data};
  // console.log(arr);
  // console.log(obj);
});

//initialize page
function init() {
  // initMap();
  passAuth(authorization);
  cardsEventApi();
  signUp(authorization);
  signIn(authorization);
  signOut(authorization);
  authStateChanged(authorization, wholeDb);
  getMyRecipes();
}

init();
module.exports = {
  authorization,
  wholeDb
};
