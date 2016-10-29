import {define, h} from 'skatejs'
import {parentSelector} from './parentSelector.js'

const animate = function(elem){
  elem.dispatchEvent(new Event('animate'));
  setTimeout( () => { window.requestAnimationFrame( () => {animate(elem)} ) }, 1000/elem.fps );
}

const css = `graph-container, :host {display: inline-table}`

const GraphContainer = define('graph-container',
 {
   props: {
     fps: { attribute: true, default: 120 }
   },
   attached(elem) {
     animate(elem);
  },
  attributeChanged(elem) {
  },
  render(elem) {
    return [
      h('slot', {
        onSlotchange: (e) => {elem.dispatchEvent(new Event("graph-updated"))}
      }),
      h('style',css)
    ]
  },
  updated(elem){
    console.log("updated")
    return true;
  }
});

export function parentGraphContainer(elem){
  return parentSelector(elem,'graph-container')
}

export default GraphContainer
