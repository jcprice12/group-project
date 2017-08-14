const RecipeForm = `  <form>
            <div class="form-group">
              <label for="ingredients">Ingredients</label>
              <input type="text" class="form-control" id="ingredients" placeholder="Ex: chicken, rice, broccoli">
            </div>
            <div class="form-group">
              <label for="ingredients">Exclude ingredients</label>
              <input type="text" class="form-control" id="exclude-ingredients"
                     placeholder="Ex: mushrooms, sugar, walnuts">
            </div>
            <div class="form-group">
              <label for="min-calories" style="display:block;">Calories</label>
              <input type="number" class="form-control" style="display:inline-block; width:45%" min="0"
                     id="min-calories" aria-describedby="caloriesHelp" placeholder="Min">
              &nbsp;-&nbsp;
              <input type="number" class="form-control" style="display:inline-block; width:45%" min="0"
                     id="max-calories" aria-describedby="caloriesHelp" placeholder="Max">
            </div>
            <div id="accordion" role="tablist" aria-multiselectable="true">
              <div class="mb-2">
                <a class="collapse-menu" data-toggle="collapse" data-parent="#accordion" href="#collapseOne"
                   aria-expanded="true" aria-controls="collapseOne">
                  Special Diet <span class="plus-minus">(+)</span>
                </a>
              </div>
              <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
                <div class="row mb-2">
                  <div class="col-6">
                    <ul class="form-list">
                      <li>
                        <label class="form-check-label">
                          <input type="radio" name="diet" value="pescetarian" class="form-check-input mr-1 diet"
                                 id="pescetarian">Pescetarian
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="radio" name="diet" value="ovo-vegetarian" class="form-check-input mr-1 diet"
                                 id="ovo vegetarian">Ovo vegetarian
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="radio" name="diet" value="vegan" class="form-check-input mr-1 diet" id="vegan">Vegan
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="radio" name="diet" value="lacto-vegetarian" class="form-check-input mr-1 diet"
                                 id="lacto vegetarian">Lacto vegetarian
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div class="col-6">
                    <ul class="form-list">
                      <li>
                        <label class="form-check-label">
                          <input type="radio" name="diet" value="paleo" class="form-check-input mr-1 diet" id="paleo">Paleo
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="radio" name="diet" value="primal" class="form-check-input mr-1 diet" id="primal">Primal
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="radio" name="diet" value="vegetarian" class="form-check-input mr-1 diet"
                                 id="vegetarian">Vegetarian
                        </label>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              <div class="mb-2">
                <a class="collapsed collapse-menu" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"
                   aria-expanded="false" aria-controls="collapseTwo">
                  Dietary Restrictions <span class="plus-minus">(+)</span>
                </a>
              </div>
              <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
                <div class="row mb-2">
                  <div class="col-6">
                    <ul class="form-list">
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="dairy">Dairy
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="egg">Egg
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="gluten">Gluten
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="peanut">Peanut
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="tree  nut">Tree nuts
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="wheat">Wheat
                        </label>
                      </li>
                    </ul>

                  </div>
                  <div class="col-6">
                    <ul class="form-list">
                      <li></li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="sesame">Sesame
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="seafood">Seafood
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="shellfish">Shellfish
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="soy">Soy
                        </label>
                      </li>
                      <li>
                        <label class="form-check-label">
                          <input type="checkbox" class="form-check-input mr-1 intolerance" id="sulfite">Sulfite
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn btn-secondary my-2 my-sm-0" type="submit" id="search">Search</button>
          </form>`;

module.exports = {
  RecipeForm
};