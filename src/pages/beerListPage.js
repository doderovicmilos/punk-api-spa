import beerListItemTemplate from "../templates/beerListItemTemplate.html"
import errorTemplate from "../templates/errorTemplate.html";
import loaderTemplate from "../templates/loaderTemplate.html";


export default class BeerListPage {

  constructor(router) {
    this.router = router;
    this.pageNumber = router.extractQueryParam('pageNumber');
    this.pageSize = router.extractQueryParam('pageSize');
    this.list = [];
    this.error = null;
    this.loading = false;
    this.load();
  }

  load(){
    this.onLoadPending();
    fetch(`https://api.punkapi.com/v2/beers/?page=${this.pageNumber}&per_page=${this.pageSize}`)
      .then(response => response.json())  // convert to json
      .then(response => {
        if (response.statusCode >= 400) this.onLoadError(response);
        else this.onLoadSuccess(response);
      })
      .catch(err => this.onLoadError(err));
  }

  onLoadPending(){
    this.loading = true;
    this.list = [];
    this.error = null;
    this.router.render(this);
  }

  onLoadSuccess(data){
    this.loading = false;
    this.list =  [ ...data ];
    this.router.render(this);
  }

  onLoadError(error){
    this.loading = false;
    this.error = error;
    this.router.render(this);
  }

  getListContent(){
    const container = document.createElement('section');

    this.list.forEach(el => {
      const element = document.createElement('div');
      element.innerHTML = beerListItemTemplate;
      element.querySelector('.list-item-title a').innerText = el.name;
      element.querySelector('.list-item-title a').href = `#/details/${el.id}`
      container.appendChild(element);
    })
    return container;
  }

  getErrorContent(){
    const element = document.createElement('section');
    element.innerHTML = errorTemplate;
    element.querySelector('.error-message').innerText = this.error.message;
    return element;
  }

  getLoaderContent(){
    const element = document.createElement('section');
    element.innerHTML = loaderTemplate;
    element.querySelector('.loader-message').innerText = 'Loading list page...';
    return element;
  }

  getContent(){
    if (this.error) return this.getErrorContent();
    else if (this.loading) return this.getLoaderContent();
    else return this.getListContent();
  };

}

