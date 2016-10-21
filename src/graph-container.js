import {define, h} from 'skatejs'

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
});

export default GraphContainer
