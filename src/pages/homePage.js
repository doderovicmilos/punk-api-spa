import homeTemplate from "../templates/homeTemplate.html";

export default class HomePage{
  render() {
    const element = document.createElement('section');
    element.innerHTML = homeTemplate;
    element.querySelector('.home-page-message').innerText = 'Home page...';
    document.getElementById('app').innerHTML = "";
    document.getElementById('app').appendChild(element);
  }
}