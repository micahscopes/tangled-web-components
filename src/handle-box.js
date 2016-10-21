import { define, h } from 'skatejs';
import {startDragging, stopDragging, draggableHostStyle} from './draggable.js';

const css = ` :host {display: inline-table} handle-box {display: inline-table}`

const HandleBox = define("handle-box",{
    attached(elem){
      startDragging(elem);
    },
    detached(elem){
      stopDragging(elem);
    },
    render(elem){
      return [h("slot",""),h("style",draggableHostStyle+css)]
    },
    rendered(elem){
    }
})
