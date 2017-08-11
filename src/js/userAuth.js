//const firebase = require('firebase');
import {authorization} from './api.js';
import {wholeDb} from './api.js';

var modalInIsOpen = false
$('#signInModal').on('shown.bs.modal', function(e) { modalInIsOpen = true;})
$('#signInModal').on('hidden.bs.modal', function(e) { modalInIsOpen = false;})

var modalUpIsOpen = false;
$('#signUpModal').on('shown.bs.modal', function(e) { modalUpIsOpen = true;})
$('#signUpModal').on('hidden.bs.modal', function(e) { modalUpIsOpen = false;})

function signUp(){
	$("#signUpSubmitButton").on("click", function(){
		var email = $("#up-email-input").val();
		var password = $("#up-password-input").val();
		if(authorization.currentUser){
			console.log("a user is already signed in, cannot sign up");
			$("#up-error-message").text("A user is already logged on, you must sign out to sign up");
		} else{
			authorization.createUserWithEmailAndPassword(email, password).catch(function(error) {
				console.log("Could not sign up");
				$("#up-error-message").text(error.message);
			});
		}
	});
}

function signIn(){
	$("#signInSubmitButton").on("click", function(){
		var email = $("#in-email-input").val();
		var password = $("#in-password-input").val();
		if(authorization.currentUser){
			console.log("a user is already signed in, cannot sign up");
			$("#up-error-message").text("A user is already logged on, you must sign out to sign up");
		} else{
			authorization.signInWithEmailAndPassword(email, password).catch(function(error){
				console.log("Could not log in: " + error.code);
				$("#in-error-message").text(error.message);
			});
		}
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
			var usersRef = wholeDb.ref("usersInformation/");
			console.log("usersRef");
			usersRef.once("value", function(snap){
				if(!(snap.hasChild(myUser.uid))){
					var userRef = wholeDb.ref("usersInformation").child(myUser.uid);
					userRef.set({
						iExist: true,
					});
				}
			});
			console.log(myUser);
			console.log(myUser.uid + " is signed in ");
			if(modalInIsOpen){
				$('#in-error-message').html("");
				$('#in-email-input').val("");
				$('#in-password-input').val("");
				$('#signInModal').modal("hide");
			}
			if(modalUpIsOpen){
				$('#up-error-message').html("");
				$('#up-email-input').val("");
				$('#up-password-input').val("");
				$('#signUpModal').modal("hide");
			}
			if(myUser.displayName){
				$("#userIdP").text(myUser.displayName);
			} else {
				$("#userIdP").text(myUser.email);
			}
			$("#userIdP").css("display", "inline-block");
			$("#signOutButton").css("display","inline-block");
			$("#signInButton").css("display","none");
			$("#signUpButton").css("display","none");
		} else {
			console.log("a user is not logged in");
			$("#userIdP").css("display", "none");
			$("#userIdP").html("");
			$("#signOutButton").css("display","none");
			$("#signInButton").css("display","inline-block");
			$("#signUpButton").css("display","inline-block");
		}
	});
}

module.exports = {
  signUp, signIn, signOut, authStateChanged
};