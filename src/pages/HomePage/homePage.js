import homeTemplate from "./homeTemplate.html";

export default class HomePage{

  constructor(router) {
    router.render(this);
  }

  getContent() {
    const element = document.createElement('section');
    element.className = 'page home-page'
    element.innerHTML = homeTemplate;
    element.querySelector('.home-page-message').innerText = 'Home page...';
    return element;
  }
}