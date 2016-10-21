import { define, h } from 'skatejs';
import {startDragging, stopDragging, draggableHostStyle} from './draggable.js';

var puppyStyle = `
  div {
    display: inline-block;
    background-image: url(http://i.imgur.com/B2YwP9u.gif);
    background-position: center;
    background-size: 100%;
    margin: 0;
    padding: 0;
    width: 64px;
    height: 150px;
    border: solid deeppink 5px;
  }
  puppy-dog {
    display: inline-block;
    // position: relative;
    background-size: 100%;
    margin: 0;
    padding: 0;
  }
  :host {
    display: inline-block;
    // position: relative;
    background-size: 100%;
    margin: 0;
    padding: 0;
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
      return [h("div",""),h("style",puppyStyle)]
    },
    rendered(elem){
    }
})
