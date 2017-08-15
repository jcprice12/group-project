import {printStars, getCard, recipeEventApi} from './api.js'
import {MyLoadAnimation1} from './MyLoadAnimation1.js';

function getPopularCard(title, servings, time, img, recipeId, url, stars, instructions) {
  let card = `<div class="card featured-recipe">
	            <div class="card-block row">
		            <div class="col-4">
		                <img class="img-fluid"
		                 src=${img}
		                 alt="Card image cap"
		                 style="width: 100%">
		            </div>
		            <div class="col-8">
		                <h4 class="card-title">${title}</h4>
		                ${stars}
		                <ol style="padding-left:15px;">${instructions}
		                	<li style="list-style:none;"><br><a href="#" id="more-instructions" url=${url} recipeid=${recipeId}>More instructions...</a></li>
		                </ol>
		                <hr>
		                <div class="featured-footer">
		                  <div class="card-cooktime mr-3 mr-sm-1 ">
		                    <i class="fa fa-clock-o"></i>
		                    <span class="icon-text"><small>${time}</small></span>
		                  </div>
		                  <div class="card-yield mr-3 mr-sm-1 ">
		                    <i class="fa fa-pie-chart"></i>
		                    <span class="icon-text"><small>${servings} servings</small></span>
		                  </div>
		                </div>
		            </div>
	            </div>
        	</div>`;
   return card;
}

function printPopular() {
	var db = firebase.database();
    var top50Ref = db.ref("/top50Recipes");
	top50Ref.once("value", function(snap) {
		if (snap.exists()) {
	    	var top50Arr = snap.val().recipesArray;
	    	var top3Recipes = top50Arr.slice(0, 3);
	    	var html = "";
	    	$(top3Recipes).each(function(index, value){
				var recipe = top3Recipes[index]
			    let img = recipe.image;
			    let title = recipe.title;
			    let servings = recipe.servings;
			    let time ='';
			    if (typeof recipe.preparationMinutes !== 'undefined') {
				    time = recipe.preparationMinutes + ' m';
				} else {
					time = 'unknown';
				}
			    let recipeId = recipe.id;
			    let url = recipe.sourceUrl ? recipe.sourceUrl : 'none';
			    let stars = printStars(recipe.spoonacularScore);
			    let instructions = ""
			    $(recipe.analyzedInstructions[0].steps).each(function(index, value){
			    	var instrNum = recipe.analyzedInstructions[0].steps[index].step;
			    	var instrListItem = ("<li>" + instrNum + "</li>");
			    	if (instructions.length < 100){
			    		instructions += instrListItem;
			    	} 
			    });

			    html += getPopularCard(title, servings, time, img, recipeId, url, stars, instructions);
	    	});
	    	$("#popular-recipes").html(html);
	    	recipeEventApi();
	    	$("#see-more-popular").on("click", function(){
	    		seeMorePopular(top50Arr);
	    	});
		} // end if(snap.exists())
		else {
	  		console.log("Error with getting top50Ref from Firebase");
		};
	}); //end top50Ref.once()
};

function seeMorePopular(arr) {
	var html = '';
	$(arr).each(function(index, value){
		var recipe = arr[index];
		let url = recipe.sourceUrl ? recipe.sourceUrl : 'none';
	    let img = recipe.image;
	    let title = recipe.title;
	    let servings = recipe.servings;
	    let time = recipe.preparationMinutes;
	    let recipeId = recipe.id;
	    let stars = printStars(recipe.spoonacularScore);
    	html += getCard(title, servings, time, img, url, recipeId, stars);
	});
	var parentContainer = document.getElementById("cardsLoadContainer");
	$(parentContainer).css("display", "none");
    // myLoadAnimation1.stopAndRemove();
    $('.card-columns').html(html);
    $(".card-columns").css("display", "block");
    recipeEventApi();
};



module.exports = {
  printPopular,
};