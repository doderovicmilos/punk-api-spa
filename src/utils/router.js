import homePage from '../pages/homePageTemplate';
import beerListPage from "../pages/beerListPageTemplate";
import errorPage from "../pages/errorPageTemplate";
import beerDetailsPage from "../pages/beerDetailsPageTemplate";

const routes = [
  { path: /^\/$/, component: homePage },
  { path: /^\/details\/\d{1,2}$/, component: beerDetailsPage }
];


const router = () => {
  // TODO: Get the current path
  // TODO: Find the component based on the current path
  // TODO: If there's no matching route, get the "Error" component
  // TODO: Render the component in the "app" placeholder
  // Find the component based on the current path
  const path = parseLocation();



  const id =  path.match(/\/([0-9]+)(?=[^\/]*$)/, 'gm') ? path.match(/\/([0-9]+)(?=[^\/]*$)/, 'gm')[1] : null;


  // // If there's no matching route, get the "Error" component
  const { component = errorPage } = findComponentByPath(path, routes) || {};
  // // Render the component in the "app" placeholder
  document.getElementById('app').innerHTML = component.render(id);


};

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

const findComponentByPath = (path, routes) => routes.find(r => path.match(r.path, 'gm')) || undefined;


window.addEventListener('hashchange', router);
window.addEventListener('load', router);
