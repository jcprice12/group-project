class Card extends HTMLElement {
  constructor() {
    super();
    this._source = '';
    this._time = '';
    this._servings = '';
    this._title = '';
    this._url = '';
    this._recipeId = '';
    this._stars = '';
  }
  get source(){
    return this._source;
  }
  get title(){
    return this._title;
  }
  get time(){
    return this._time;
  }
  get servings(){
    return this._servings;
  }
  get url(){
    return this._url;
  }
  get recipeId(){
    return this._recipeId;
  }
  get stars(){
    return this._stars;
  }
  connectedCallback() {
    this._source = this.getAttribute('source');
    this._time = this.getAttribute('time');
    this._servings = this.getAttribute('servings');
    this._title = this.getAttribute('title');
    this._url = this.getAttribute('url');
    this._recipeId = this.getAttribute('recipeId');
    this._stars = this.getAttribute('stars')
    let template =
      `
        <div data-recipeId="${this.recipeId}" class="card card-recipe">
          <img class="card-img-top img-fluid"
               src="${this.source}"
               alt="Card image cap"
               style="width: 100%">
          <div class="card-img-overlay" >
            <div class="heart">
              <i class="fa fa-heart-o"></i>
            </div>
          </div>
          <div class="card-block">
            <div class="card-block">
              <h4 class="card-title">${this.title}</h4>
              ${this.stars}
            </div>
          </div>
          <div class="card-footer">
            <div class="footer-icons d-flex flex-row justify-content-start">
                <div class="card-cooktime mr-3 mr-sm-1 ">
                  <i class="fa fa-clock-o"></i>
                  <span class="icon-text"><small>${this.time}</small></span>
                </div>
                <div class="card-yield mr-3 mr-sm-1 ">
                  <i class="fa fa-pie-chart"></i>
                  <span class="icon-text"><small>${this.servings} servings</small></span>
                </div>
              </div>
          </div>
        </div>
      `;
    this.innerHTML = template;
  }
}
window.customElements.define('my-card', Card);