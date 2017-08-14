import '../css/style.scss';
import 'jquery';
import 'tether';
import 'bootstrap';
import axios from 'axios';

import {cardsEventApi, passAuth} from './api.js';
import {signIn, signUp, signOut, authStateChanged} from './userAuth.js';
import {initMap} from './googleMaps.js';

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

//initialize page
function init() {
  initMap();
  passAuth(authorization);
  cardsEventApi();
  signUp(authorization);
  signIn(authorization);
  signOut(authorization);
  authStateChanged(authorization, wholeDb);
}
init();
module.exports = {
  authorization,
  wholeDb
};
