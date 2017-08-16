import axios from 'axios';
import {recipeEventApi,getCard,} from './api.js';
import {MyLoadAnimation1} from './MyLoadAnimation1.js';

function getRecipesFromDb(keysArr,counter,recipesArray,htmlStr,loadParent,loadAnimation1){
	if(counter < keysArr.length){
		var myPromise = firebase.database().ref("recipes/" + keysArr[counter]).once("value", function(snap){
			var url = snap.val().sourceUrl ? snap.val().sourceUrl : 'none'
			htmlStr += getCard(snap.val().title, snap.val().servings, snap.val().preparationMinutes, snap.val().image, url, snap.val().id);
			getRecipesFromDb(keysArr,(counter + 1),recipesArray,htmlStr,loadParent,loadAnimation1);
		}, function(error){
			console.log(error.code);
			getRecipesFromDb(keysArr,(counter + 1),recipesArray,htmlStr,loadParent,loadAnimation1);
		});
	} else {
		$(loadParent).css("display", "none");
      	loadAnimation1.stopAndRemove();
		$('.card-columns').html(htmlStr);
      	$(".card-columns").css("display", "block");
      	recipeEventApi();
	}
}

function getUserRecipesFromDb(userId){
	var recipesPromise = firebase.database().ref("userRecipes/" + userId).once("value");
	return recipesPromise;
}

function buildRecipes(userId){
	var recipesPromise = getUserRecipesFromDb(userId);
	var parentContainer = document.getElementById("cardsLoadContainer");
	$(parentContainer).css("display", "block");
	var loadAnimation1 = new MyLoadAnimation1(parentContainer,75,12,4,["#b7cb39","#f76f4d"]);
	loadAnimation1.startAll();
	recipesPromise.then(function(snap){
		var recipes = snap.val();
		console.log(recipes);
		var keysArr = Object.keys(recipes);
		$('.recipe-container').html("");
  		$('.card-columns').html("");
		getRecipesFromDb(keysArr,0,[],"",parentContainer,loadAnimation1);
	}).catch(function(error){
		$(parentContainer).css("display", "none");
      	loadAnimation1.stopAndRemove();
		console.log(error.code);
	});
}


function getMyRecipes(){
	$("#getMyRecipesButton, .my-rec").on("click", function(event){
		$('.home').css('display', 'none');
		if(firebase.auth().currentUser){
			if(!firebase.auth().currentUser.isAnonymous){
				buildRecipes(firebase.auth().currentUser.uid);
			}
		}
	});
}

module.exports = {
  getMyRecipes,
};