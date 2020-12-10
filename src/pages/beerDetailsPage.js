import beerDetailsTemplate from "../templates/beerDetailsTemplate.html";
import errorTemplate from "../templates/errorTemplate.html";
import loaderTemplate from "../templates/loaderTemplate.html";



export default class BeerDetailsPage {

  constructor(router) {
    this.id = router.extractId();
    this.router = router;
    this.model = {};
    this.error = null;
    this.loading = false;
    this.load();
  }

  load(){
    this.onLoadPending();
    fetch(`https://api.punkapi.com/v2/beers/${this.id}`)
      .then(response => response.json())  // convert to json
      .then(response => {
        if (response.statusCode >= 400) this.onLoadError(response);
        else this.onLoadSuccess(response);
      })
      .catch(err => this.onLoadError(err));
  }

  onLoadPending(){
    this.loading = true;
    this.model = {};
    this.error = null;
    this.router.render(this);
  }

  onLoadSuccess(data){
    this.loading = false;
    this.model = { ...data[0] };
    this.router.render(this);
  }

  onLoadError(error){
    this.loading = false;
    this.error = error;
    this.router.render(this);
  }

  getDetailsContent(){
    const element = document.createElement('div');
    element.innerHTML = beerDetailsTemplate;
    element.querySelector('.details-name').innerText = this.model.name;
    element.querySelector('.details-description').innerText = this.model.description;
    return element;
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
    element.querySelector('.loader-message').innerText = 'Loading details page...';
    return element;
  }

  getContent(){
      if(this.error) return this.getErrorContent();
      if(this.loading) return this.getLoaderContent();
      else return this.getDetailsContent();
  };

}