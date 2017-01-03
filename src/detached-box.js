import { define, h } from 'skatejs';
import {detach, reattach} from './detachable.js';

const css = ` :host {display: inline-table} loose-box {display: inline-table}`

const DetachedBox = define("detached-box",{
    attached(elem){
      detach(elem);
    },
    detached(elem){
      reattach(elem);
    },
    render(elem){
      return [h("slot",""),h("style",css)]
    },
    rendered(elem){
    }
})

export default DetachedBox
