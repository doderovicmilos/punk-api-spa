import homePage from '../pages/homePage';
import beerListPage from "../pages/beerListPage";
import errorPage from "../pages/errorPage";
import BeerDetailsPage from "../pages/beerDetailsPage";

class Router {

  constructor() {
    this.routes = [
      {pathPattern: /^\/$/, component: homePage},
      {pathPattern: /^\/list/, component: beerListPage},
      {pathPattern: /^\/details\/\d{1,4}$/, component: BeerDetailsPage}
    ];
    window.addEventListener('hashchange', this.route.bind(this));
    window.addEventListener('load', this.route.bind(this));
  }

  route() {
    const path = this.parseLocation();
    const componentClass = this.findComponentByPath(path) ? this.findComponentByPath(path).component : errorPage;
    const component = new componentClass(this);
  }

  parseLocation() {
    return location.hash.slice(1) || '/';
  }

  findComponentByPath(path) {
    return this.routes.find(r => path.match(r.pathPattern, 'gm')) || null;
  }

  extractId() {
    const path = this.parseLocation();
    return path.match(/\/([0-9]+)/, 'gm') ? path.match(/\/([0-9]+)/, 'gm')[0].replace("/", "") : null;
  }

  extractQueryParam(param) {
    const path = this.parseLocation();
    return path.match(`(${param}=[0-9]+)`, 'gm') ? path.match(`(${param}=[0-9]+)`, 'gm')[0].replace(`${param}=`, "") : null;
  }

  render(component){
    document.getElementById('app').innerHTML = "";
    document.getElementById('app').appendChild(component.getContent());
  }

}

export default new Router();