AFRAME.registerComponent('combat-weapon', {
  schema: {
    type: { type: 'string', default: 'sword' }, 
    swingRot: { type: 'vec3', default: {x: -60, y: 45, z: -45} } 
  },
  init: function () {
    // When anywhere on the screen is clicked, swing!
    document.querySelector('a-scene').addEventListener('mousedown', () => {
      this.triggerAction();
    });
  },
  triggerAction: function() {
    this.el.removeAttribute('animation__swing'); 
    this.el.setAttribute('animation__swing', {
      property: 'rotation',
      to: `${this.data.swingRot.x} ${this.data.swingRot.y} ${this.data.swingRot.z}`,
      dur: 150,          
      dir: 'alternate',  
      loop: 1,
      easing: 'easeInQuad'
    });
  }
});
