import {pubSub} from "../utils/pubsub";

const LOAD_PENDING = "LOAD_PENDING"
const LOAD_SUCCESS = "LOAD_SUCCESS"
const LOAD_ERROR = "LOAD_ERROR"

export default class BeerDetailsPage {

  constructor({id}) {
    this.id = id;
    this.model = {};
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
    fetch(`https://api.punkapi.com/v2/beers/${this.id}`)
      .then(response => response.json())  // convert to json
      .then(response => {
        if (response.statusCode >= 400) this.ps.publish(LOAD_ERROR, response);
        else this.ps.publish(LOAD_SUCCESS, response)
      })
      .catch(err => this.ps.publish(LOAD_ERROR,  err));
  }

  onLoadPending(){
    this.loading = true;
    this.model = {};
    this.error = null;
    this.render();
  }

  onLoadSuccess(data){
    this.loading = false;
    this.model = { ...data[0] };
    this.render();
  }

  onLoadError(error){
    this.loading = false;
    this.error = error;
    this.render();
  }

  render(){
    document.getElementById('app').innerHTML =
      this.error
        ?
        `<section><h3>Error loading page</h3></section>`
        :
        this.loading
          ?
          `<section><h3>Loading details</h3></section>`
          :
          `<section><h3>Name: ${this.model.name}</h3></section>`
  };


}