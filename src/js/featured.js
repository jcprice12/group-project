function getPopularCard(title, servings, time, img, instructions, stars) {
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
		                <ol>${instructions}
		                	<li>More instructions...</li>
		                </ol>
		                <hr>
		                <div class="featured-footer">
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
	    	console.log(top3Recipes);
	    	$(top3Recipes).each(function(index, value){
				var recipe = top3Recipes[index]
			    let img = recipe.image;
			    let title = recipe.title;
			    let servings = recipe.servings;
			    let time = recipe.preparationMinutes;
			    let stars = printStars(recipe.spoonacularScore)
			    let instructions = ""
			    $(recipe.analyzedInstructions[0].steps).each(function(index, value){
			    	var instrNum = recipe.analyzedInstructions[0].steps[index].step;
			    	var instrListItem = ("<li>" + instrNum + "</li>");
			    	if (instructions.length < 100){
			    		instructions += instrListItem;
			    	} 
			    });

			    html += getPopularCard(title, servings, time, img, instructions, stars);
	    	});
	    	$("#popular-recipes").html(html);
	    	

		} // end if(snap.exists())
		else {
	  		console.log("Error with getting top50Ref from Firebase");
		};
	}); //end top50Ref.once()
};

function printStars(spoonScore){
    let score = {
	    fullstars : (function(){
	    	if (spoonScore%20 >15) {
	    		return (Math.floor(spoonScore/20)+1)
	    	} else {
	    		return Math.floor(spoonScore/20)
	    	}
	    }),
	   	halfstar : (function(){
	    		if (spoonScore%20 <= 15 && spoonScore%20 >= 5){
	    			return 1;
	    		} else {
	    			return 0;
	    		}
	    	})
   }
   var starsStr = "";
   for (var i=0; i < score.fullstars(); i++) {
	   	if (score.fullstars() > 0){
	   		starsStr += '<i class="fa fa-star">&nbsp;</i>'
	   	}
   };
   if (score.halfstar() > 0) {
   	starsStr +=  '<i class="fa fa-star-half"></i>'
   };
   return starsStr;
};

module.exports = {
  printPopular,
};