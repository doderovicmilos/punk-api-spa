import {pubSub} from "../utils/pubsub";
import beerListItemTemplate from "../templates/beerListItemTemplate.html"
import errorTemplate from "../templates/errorTemplate.html";
import loaderTemplate from "../templates/loaderTemplate.html";

const LOAD_PENDING = "LOAD_PENDING"
const LOAD_SUCCESS = "LOAD_SUCCESS"
const LOAD_ERROR = "LOAD_ERROR"

export default class BeerListPage {

  constructor({pageNumber, pageSize}) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.list = [];
    this.error = null;
    this.loading = false;

    this.ps = pubSub();
    this.ps.subscribe(LOAD_PENDING, this.onLoadPending.bind(this));
    this.ps.subscribe(LOAD_SUCCESS, this.onLoadSuccess.bind(this));
    this.ps.subscribe(LOAD_ERROR, this.onLoadError.bind(this));
    this.load();
  }

  load(){
    this.ps.publish(LOAD_PENDING);
    fetch(`https://api.punkapi.com/v2/beers/?page=${this.pageNumber}&per_page=${this.pageSize}`)
      .then(response => response.json())  // convert to json
      .then(response => {
        if (response.statusCode >= 400) this.ps.publish(LOAD_ERROR, response);
        else this.ps.publish(LOAD_SUCCESS, response)
      })
      .catch(err => this.ps.publish(LOAD_ERROR,  err));
  }

  onLoadPending(){
    this.loading = true;
    this.list = [];
    this.error = null;
    this.render();
  }

  onLoadSuccess(data){
    this.loading = false;
    this.list =  [ ...data ];
    this.render();
  }

  onLoadError(error){
    this.loading = false;
    this.error = error;
    this.render();
  }

  renderListItems(){
    const container = document.createElement('section');

    this.list.forEach(el => {
      const element = document.createElement('div');
      element.innerHTML = beerListItemTemplate;
      element.querySelector('.list-item-title a').innerText = el.name;
      element.querySelector('.list-item-title a').href = `#/details/${el.id}`
      container.appendChild(element);
    })

    document.getElementById('app').innerHTML = "";
    document.getElementById('app').appendChild(container);
  }

  renderError(){
    const element = document.createElement('section');
    element.innerHTML = errorTemplate;
    element.querySelector('.error-message').innerText = this.error.message;
    document.getElementById('app').innerHTML = "";
    document.getElementById('app').appendChild(element);
  }

  renderLoader(){
    const element = document.createElement('section');
    element.innerHTML = loaderTemplate;
    element.querySelector('.loader-message').innerText = 'Loading list page...';
    //document.getElementById('app').innerHTML = "";
    document.getElementById('app').appendChild(element);
  }

  render(){

    if (this.error) this.renderError();
    else if (this.loading) this.renderLoader();
    else this.renderListItems();

  };


}

