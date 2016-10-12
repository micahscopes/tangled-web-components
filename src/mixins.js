import d3 from 'd3'
import riot from 'riot'

export const Animate = {
  init: function(){
    this.on('before-mount', () => {
      this.setup();
      this.animate();
    })
  },
  setup: function() {
    this.trigger('initializaton-station');
  },
  animate: function(){
    // if (this.lastWidth != canvas.clientWidth || this.lastHeight != canvas.clientHeight) {
    //   this.renderer.setSize( canvas.clientWidth, canvas.clientHeight, false);
    //   this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //   this.camera.updateProjectionMatrix();
    // }
    window.requestAnimationFrame( this.animate );
    this.trigger('animate',this);
  },
}

// export const ClickZoomMixin = {
//   init: function() {
//     var self = this;
//     this.root.addEventListener('click',function(e){
//       window.requestAnimationFrame(()=>self.trigger('zoom'));
//     });
//     this.on('zoom',this.zoom);
//     riot.route(function(hash){
//       if(hash==""){ self.trigger('unzoom') }
//     });
//     this.on('unzoom',this.unzoom);
//     window.addEventListener('keyup',function(k){
//       if(k.code == 'Escape') {
//         location.hash=""
//       }
//     });
//   },
//   zoom: function(){
//     location.hash = "zoomed"
//     this.root.classList.add("zoomed")
//   },
//   unzoom: function(){
//     this.root.classList.remove("zoomed")
//   },
//   isZoomed: function(){
//     return this.root.classList.contains('zoomed');
//   }
// }
//
// export const TurntableMixin = {
//   init: function(){
//     var self = this;
//     if (this.onRotation == undefined){
//       this.onRotation = [];
//     }
//     let dRot = self.dRotation = new THREE.Vector3;
//     dRot.y = 0.02;
//
//     this.on('mount',function(){
//       self.rotate();
//     })
//     window.addEventListener('keyup',function(k){
//       // if this object also mixes in the zoom module, then
//       // only pause/unpause when zoomed
//       if(k.key == " " && (self.isZoomed() || !self.isZoomed)){
//          self.pauseRotation = !self.pauseRotation
//        }
//     })
//   },
//   rotate: function(objs){
//     window.requestAnimationFrame(this.rotate);
//     var dRot = this.dRotation;
//     for (var o of this.onRotation) {
//       if(o.rotation && !this.pauseRotation){
//         o.rotation.x += dRot.x;
//         o.rotation.y += dRot.y;
//         o.rotation.y += dRot.z;
//       }
//     }
//   }
// }
