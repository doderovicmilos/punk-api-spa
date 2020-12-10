// import {pubSub} from "../utils/pubsub.js";
//
// const LIST_PAGE_SELECT = "LIST_PAGE_SELECT"
// const LOAD_LIST = "LOAD_LIST"
// const LOAD_LIST_SUCCESS = "LOAD_LIST_SUCCESS"
// const LOAD_LIST_ERROR = "LOAD_LIST_ERROR"
//
// const ps = pubSub();
//
//
// //async functoion
//
// //const template = await fetch('./pages/beerListItemTemplate.html').then(response => response.text());
//
//
//
// //const element = parser.parseFromString(template, "text/html");
//
// //console.log(template);
//
// document.getElementById("home").onclick = () => ps.publish(LIST_PAGE_SELECT);
//
// ps.subscribe(LIST_PAGE_SELECT, onListPageSelect);
// ps.subscribe(LOAD_LIST_SUCCESS, onLoadListSuccess);
// ps.subscribe(LOAD_LIST_ERROR, onLoadListError);
//
//
// function onListPageSelect () {
//   ps.publish(LOAD_LIST);
//
//   fetch('https://api.punkapi.com/v2/beers/?page=1&per_page=10')
//     .then(response => response.json())  // convert to json
//     .then(data => ps.publish(LOAD_LIST_SUCCESS, data))    //print data to console
//     .catch(err => ps.publish(LOAD_LIST_ERROR,  err)); // Catch errors
// }
//
//
// function onLoadListSuccess(data){
//   const container = document.createElement('div');
//
//   data.forEach(e => {
//     const element = document.createElement('h3');
//     //element.innerHTML = e.name;
//
//     const clone = document.importNode(template.content, true);
//
//     clone.querySelector('.list-item-title a').innerText = e.name
//
//     container.appendChild(clone);
//   });
//
//   const content = document.getElementById("content");
//   content.innerHTML = "";
//   content.appendChild(container);
// }
//
// function onLoadListError(error){
//   const element = document.createElement('div');
//
//   element.innerHtml = error.description;
//
//   const content = document.getElementById("content");
//   content.innerHTML = "";
//   content.appendChild(element);
// }
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

