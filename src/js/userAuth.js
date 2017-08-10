//const firebase = require('firebase');
import {authorization} from './api.js';
import {wholeDB} from './api.js';

function signUp(){
	$("#signUpSubmitButton").on("click", function(){
		var email = $("#up-email-input").val();
		var password = $("#up-password-input").val();
		authorization.createUserWithEmailAndPassword(email, password).catch(function(error) {
			console.log("Could not sign up: " + error);
		});
	});
}

function signIn(){
	$("#signInSubmitButton").on("click", function(){
		var email = $("#in-email-input").val();
		var password = $("#in-password-input").val();
		authorization.signInWithEmailAndPassword(email, password).catch(function(error){
			console.log("Could not log in: " + error.code);
		});
	});
}

function signOut(){
	$("#signOutButton").on("click", function(){
		authorization.signOut();
	});
}

function authStateChanged(){
	authorization.onAuthStateChanged(function(myUser){
		if(myUser){
			console.log(myUser.uid + " is signed in ");
		} else {
			console.log("a user is not logged in");
		}
	});
}

module.exports = {
  signUp, signIn, signOut, authStateChanged
};