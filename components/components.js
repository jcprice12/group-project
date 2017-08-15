class Card extends HTMLElement {
  constructor() {
    super();
    this._source = '';
    this._time = '';
    this._servings = '';
    this._title = '';
    this._url = '';
    this._likes = '';
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
  get dataUrl(){
    return this._url;
  }
  get recipeId(){
    return this._recipeId;
  }
  get likes() {
    return this._likes;
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
    this._stars = this.getAttribute('stars');
    this._likes = this.getAttribute('likes');
    let template =
      `
        <div  class="card card-recipe">
          <img class="card-img-top img-fluid card-img"
               src="${this.source}"
               alt="Card image cap"
               style="width: 100%">
          <div class="card-img-overlay" >
            <div heart-id="${this.recipeId}" class="heart ml-auto d-flex align-items-center justify-content-center" >
              <i class="fa fa-heart-o"></i>
              <i class="fa fa-heart"></i>
            </div>
          </div>
          <div class="card-block recipe-block">
              <h4 class="card-title">${this.title}</h4>
              ${this.stars}
          </div>
          <div class="card-footer recipe-footer">
            <div class="footer-icons d-flex flex-row justify-content-between">
                <div>
                   <div class="card-likes mr-3">
                    <i class="fa fa-heart likes"></i>
                    <span class="icon-text"><small>${this.likes}</small></span>
                  </div>
                </div>
                <div class="d-flex flex-row justify-content-end">
                  <div class="card-cooktime mr-3">
                    <i class="fa fa-clock-o"></i>
                    <span class="icon-text"><small>${this.time}</small></span>
                  </div>
                  <div class="card-yield mr-3">
                    <i class="fa fa-pie-chart"></i>
                    <span class="icon-text"><small>${this.servings} servings</small></span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      `;
    this.innerHTML = template;
  }
}
window.customElements.define('my-card', Card);