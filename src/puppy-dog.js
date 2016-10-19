import { define, h } from 'skatejs';
import {startDragging, stopDragging, draggableHostStyle} from './draggable.js';

var puppyStyle = `
  :host {
    display: inline-block;
    background-image: url(http://i.imgur.com/B2YwP9u.gif);
    background-position: center;
    background-size: 100%;
    margin: 0;
    padding: 0;
    width: 100px;
    height: 150px;
    border: solid deeppink 5px;
  }
`
define("puppy-dog",{
    attached(elem){
      startDragging(elem);
    },
    detached(elem){
      // stopDragging(elem);
    },
    render(elem){
      return h("style",puppyStyle)
    },
    rendered(elem){
    }
})
