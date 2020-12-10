import errorTemplate from "../templates/errorTemplate.html";

export default class HomePage{

  constructor(router) {
    router.render(this);
  }

  getContent() {
    const element = document.createElement('section');
    element.innerHTML = errorTemplate;
    element.querySelector('.error-message').innerText = 'Requested url does not exist...';
    return element;
  }
}