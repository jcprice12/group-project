function getRecipesFromDb(keysArr,counter,recipesArray){
	console.log(counter);
	if(counter < keysArr.length){
		var myPromise = firebase.database().ref("recipes/" + keysArr[counter]).once("value", function(snap){
			recipesArray.push(snap.val());
			getRecipesFromDb(keysArr,(counter + 1),recipesArray);
		}, function(error){
			console.log(error.code);
			getRecipesFromDb(keysArr,(counter + 1),recipesArray)
		});
	} else {
		console.log(recipesArray);
		//call pat's method
	}
}

function getUserRecipesFromDb(userId){
	var recipesPromise = firebase.database().ref("userRecipes/" + userId).once("value");
	return recipesPromise;
}

function buildRecipes(userId){
	var recipesPromise = getUserRecipesFromDb(userId);
	recipesPromise.then(function(snap){
		var recipes = snap.val();
		console.log(recipes);
		var keysArr = Object.keys(recipes);
		getRecipesFromDb(keysArr,0,[]);
	}).catch(function(error){
		console.log(error.code);
	});
}


function getMyRecipes(){
	$("#getMyRecipesButton").on("click", function(event){
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