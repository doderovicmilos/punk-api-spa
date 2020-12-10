import errorTemplate from "../templates/errorTemplate.html";

export default class HomePage{
  render() {
    const element = document.createElement('section');
    element.innerHTML = errorTemplate;
    element.querySelector('.error-message').innerText = 'Requested url does not exist...';
    document.getElementById('app').innerHTML = "";
    document.getElementById('app').appendChild(element);
  }
}