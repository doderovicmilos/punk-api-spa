import homePage from '../pages/homePage';
import beerListPage from "../pages/beerListPage";
import errorPage from "../pages/errorPage";
import BeerDetailsPage from "../pages/beerDetailsPage";

const routes = [
  { pathPattern: /^\/$/, component: homePage },
  { pathPattern: /^\/list/, component: beerListPage },
  { pathPattern: /^\/details\/\d{1,2}$/, component: BeerDetailsPage }
];

const router = () => {
  const path = parseLocation();
  const id = extractId(path);
  const pageNumber = extractPageNumber(path);
  const pageSize = extractPageSize(path);
  const componentClass = findComponentByPath(path, routes) ? findComponentByPath(path, routes).component : errorPage;
  const params = { id, pageSize, pageNumber };
  const component = new componentClass(params);
  component.render();
};

const parseLocation = () => location.hash.slice(1) || '/';

const findComponentByPath = (path, routes) => routes.find(r => path.match(r.pathPattern, 'gm')) || null;

const extractId = (path) => path.match(/\/([0-9]+)/, 'gm') ? path.match(/\/([0-9]+)/, 'gm')[0].replace("/", "") : null;

const extractPageNumber = (path) => path.match(/(pageNumber=[0-9]+)/, 'gm') ? path.match(/(pageNumber=[0-9]+)/, 'gm')[0].replace("pageNumber=", "") : null;

const extractPageSize = (path) => path.match(/(pageSize=[0-9]+)/, 'gm') ? path.match(/(pageSize=[0-9]+)/, 'gm')[0].replace("pageSize=", "") : null;

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
