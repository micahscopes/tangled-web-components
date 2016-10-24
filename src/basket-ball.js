import { define, h } from 'skatejs';
import {startDragging, stopDragging, draggableHostStyle} from './draggable.js';

var puppyStyle = `
  div {
    display: inline-block;
    background-image: url('basketball.png');
    background-position: center;
    background-size: 100%;
    margin: 0;
    padding: 0;
    width: 340px;
    height: 340px;
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
define("basket-ball",{
    props: {
      round: { attribute: false, default: true },
    },
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
