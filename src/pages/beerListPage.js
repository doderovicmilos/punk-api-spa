import {pubSub} from "../utils/pubsub.js";

const LIST_PAGE_SELECT = "LIST_PAGE_SELECT"
const LOAD_LIST = "LOAD_LIST"
const LOAD_LIST_SUCCESS = "LOAD_LIST_SUCCESS"
const LOAD_LIST_ERROR = "LOAD_LIST_ERROR"

const ps = pubSub();


//async functoion

//const template = await fetch('./pages/beerListItemTemplate.html').then(response => response.text());



//const element = parser.parseFromString(template, "text/html");

//console.log(template);

document.getElementById("home").onclick = () => ps.publish(LIST_PAGE_SELECT);

ps.subscribe(LIST_PAGE_SELECT, onListPageSelect);
ps.subscribe(LOAD_LIST_SUCCESS, onLoadListSuccess);
ps.subscribe(LOAD_LIST_ERROR, onLoadListError);


function onListPageSelect () {
  ps.publish(LOAD_LIST);

  fetch('https://api.punkapi.com/v2/beers/?page=1&per_page=10')
    .then(response => response.json())  // convert to json
    .then(data => ps.publish(LOAD_LIST_SUCCESS, data))    //print data to console
    .catch(err => ps.publish(LOAD_LIST_ERROR,  err)); // Catch errors
}


function onLoadListSuccess(data){
  const container = document.createElement('div');

  data.forEach(e => {
    const element = document.createElement('h3');
    //element.innerHTML = e.name;

    const clone = document.importNode(template.content, true);

    clone.querySelector('.list-item-title a').innerText = e.name

    container.appendChild(clone);
  });

  const content = document.getElementById("content");
  content.innerHTML = "";
  content.appendChild(container);
}

function onLoadListError(error){
  const element = document.createElement('div');

  element.innerHtml = error.description;

  const content = document.getElementById("content");
  content.innerHTML = "";
  content.appendChild(element);
}


