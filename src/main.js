// import 'skatejs-web-components';
import { define, h, prop } from 'skatejs';
import './graph-components.js'

define("puppy-dog",{
  render: () => h("img",{
    src: "http://i.imgur.com/B2YwP9u.gif",
    style: "height: 100px; border: solid limegreen 4px;"
  })
})
