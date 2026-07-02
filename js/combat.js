AFRAME.registerComponent('combat-weapon', {
  schema: {
    type: { type: 'string', default: 'sword' }, 
    isHeld: { type: 'boolean', default: false },
    pcHoldPos: { type: 'vec3', default: {x: 0.4, y: -0.3, z: -0.7} },
    pcHoldRot: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    swingRot: { type: 'vec3', default: {x: -60, y: 45, z: -45} } 
  },

  init: function () {
    this.mode = 'pc'; 
    this.camera = document.querySelector('#head');
    
    // Pick up weapon
    this.el.addEventListener('click', () => {
      if (!this.data.isHeld) {
        this.equipWeapon();
      }
    });

    // Swing weapon
    document.querySelector('a-scene').addEventListener('mousedown', () => {
      if (this.data.isHeld && this.mode === 'pc') {
        this.triggerAction();
      }
    });
  },

  equipWeapon: function () {
    this.data.isHeld = true;
    if (this.el.sceneEl.is('vr-mode')) {
      this.mode = 'vr';
    } else {
      this.mode = 'pc';
      this.el.removeAttribute('ammo-body'); 
      this.camera.appendChild(this.el);
      this.el.setAttribute('position', this.data.pcHoldPos);
      this.el.setAttribute('rotation', this.data.pcHoldRot);
    }
  },

  triggerAction: function() {
    if (this.data.type === 'sword') {
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
  }
});
