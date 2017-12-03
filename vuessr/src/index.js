import _ from 'lodash'
import printMe from './print'
// import './style.css'
// import Logo from './logo.png'


function component() {
  var element = document.createElement('div')
  var btn = document.createElement('button')
  element.innerHTML = _.join(['hello', 'webpack'], ' ')
  // element.classList.add('hello')
  // var logo = new Image()
  // logo.src = Logo
  // element.appendChild(logo)

  btn.innerHTML = 'Click me and check the console'
  btn.onclick = printMe
  element.appendChild(btn)
  return element
}

document.body.appendChild(component())