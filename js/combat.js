AFRAME.registerComponent('combat-weapon', {
  schema: {
    type: { type: 'string', default: 'sword' }
  },
  init: function () {
    document.querySelector('a-scene').addEventListener('mousedown', () => {
      this.triggerAction();
    });
  },
  triggerAction: function() {
    // 1. Visual Swing
    this.el.removeAttribute('animation__swing'); 
    this.el.setAttribute('animation__swing', {
      property: 'rotation',
      to: `-60 45 -45`,
      dur: 150,          
      dir: 'alternate',  
      loop: 1,
      easing: 'easeInQuad'
    });

    // 2. Throwing Logic (If it's a throwing knife)
    if (this.data.type === 'throwable') {
      console.log("Throwing mechanics triggered! (Requires detaching from grip and applying Ammo.js impulse)");
      // Note: Real throwing requires detaching the entity from the camera rig and spawning it in world-space with velocity.
    }
  }
});
