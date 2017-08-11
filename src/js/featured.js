

// import axios from 'axios';

// function getPopularCard(title, servings, img, time, source) {
//   let card = `<div class="card featured-recipe">
//               <div class="card-block row">
//               <div class="col-4">
//                 <img class="img-fluid"
//                  src="${img}"
//                  alt="Card image cap"
//                  style="width: 100%">
//               </div>
//               <div class="col-8">
//                 <h4 class="card-title">${title}</h4>
//                 <i class="fa fa-star"></i>
//                 <i class="fa fa-star"></i>
//                 <i class="fa fa-star"></i>
//                 <i class="fa fa-star"></i>
//                 <i class="fa fa-star-half"></i>
//                 <hr>
//                 <div class="featured-footer">
//                   <div class="card-calories mr-3 mr-sm-1 ">
//                     <i class="fa fa-bar-chart-o"></i>
//                     <span class="icon-text"><small>${cals} cals</small></span>
//                   </div>
//                   <div class="card-cooktime mr-3 mr-sm-1 ">
//                     <i class="fa fa-clock-o"></i>
//                     <span class="icon-text"><small>45 m</small></span>
//                   </div>
//                   <div class="card-yield mr-3 mr-sm-1 ">
//                     <i class="fa fa-pie-chart"></i>
//                     <span class="icon-text"><small>${servings} servings</small></span>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//           </div>`;
//    return card;
// }

// function popularApi() {
//   let search = $('#ingredients').val();
  

//     var head = {
//       headers: {"X-Mashape-Key": "VftGeJE2qimshoNc94fZxoUiEp04p154Astjsn7Kuggh3FXLVw"}
//     };
//     var obj = {
//       'limitLicence': false,
//       'number': 300,
//       'query': search,
//       'ingredients': search,
//       'excludeIngredients': excludeIngredients,
//       'maxCalories': maxCalories,
//       'minCalories': minCalories,
//       'diet': diet,
//       'intolerances' : allIntolerances,
//       'ranking': 1,
//       'addRecipeInformation': true
//     };

//     for(var key in obj) {
//       if(obj[key] === "") {
//          delete obj[key]; 
//        };
//     };

//     var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?';
//     url += '?' + $.param(obj);
//     console.log(url);
//     searchRecipes(url,head);
// }

