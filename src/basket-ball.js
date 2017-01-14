import { define, h } from 'skatejs';
import {startDragging, stopDragging, draggableHostStyle} from './draggable.js';

var style = `
  ._basket-ball_inner {
    display: inline-block;
    background-image: url('basketball.png');
    background-position: center;
    background-size: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  basket-ball {
    display: inline-block;
    // position: relative;
    background-size: 100%;
    margin: 0;
    padding: 0;
    width: 340px;
    height: 340px;
  }
  :host {
    display: inline-block;
    // position: relative;
    background-size: 100%;
    margin: 0;
    padding: 0;
    width: 340px;
    height: 340px;
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
      return [h("div",{class: '_basket-ball_inner'}),h("style",style)]
    },
    rendered(elem){
    }
})
