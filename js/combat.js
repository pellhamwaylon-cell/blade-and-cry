AFRAME.registerComponent('combat-weapon', {
  schema: {
    name: { type: 'string', default: 'Unknown Weapon' },
    type: { type: 'string', default: 'sword' }, 
    isHeld: { type: 'boolean', default: false },
    vrGrabMode: { type: 'string', default: 'force' }, 
    vrGripPos: { type: 'vec3', default: {x: 0, y: 0, z: 0} }, 
    vrGripRot: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    swingRot: { type: 'vec3', default: {x: -60, y: 45, z: -45} } 
  },

  init: function () {
    this.mode = 'pc'; 
    this.hoverText = this.el.querySelector('.hover-text');
    
    this.el.addEventListener('mouseenter', () => {
      if (!this.data.isHeld && this.hoverText) this.hoverText.setAttribute('visible', 'true');
    });

    this.el.addEventListener('mouseleave', () => {
      if (this.hoverText) this.hoverText.setAttribute('visible', 'false');
    });
    
    this.el.addEventListener('click', (evt) => {
      if (!this.data.isHeld) this.equipWeapon(evt.detail.cursorEl);
    });

    document.querySelector('a-scene').addEventListener('mousedown', () => {
      if (this.data.isHeld && this.mode === 'pc') this.triggerAction();
    });
  },

  equipWeapon: function (handEl) {
    this.data.isHeld = true;
    if (this.hoverText) this.hoverText.setAttribute('visible', 'false');

    if (this.el.sceneEl.is('vr-mode')) {
      this.mode = 'vr';
      this.el.removeAttribute('ammo-body'); 
      handEl.appendChild(this.el);
      this.el.setAttribute('position', this.data.vrGripPos);
      this.el.setAttribute('rotation', this.data.vrGripRot);
    } else {
      this.mode = 'pc';
      this.el.removeAttribute('ammo-body'); 
      
      // Connect specifically to the Grip Anchor
      let pcGrip = document.querySelector('#pc-grip');
      pcGrip.appendChild(this.el);
      
      // Zero out coordinates since the anchor is already positioned perfectly
      this.el.setAttribute('position', '0 0 0');
      this.el.setAttribute('rotation', '0 0 0');
    }
  },

  triggerAction: function() {
    if (this.data.type === 'sword') {
      if (this.el.hasAttribute('animation-mixer')) {
        this.el.setAttribute('animation-mixer', 'clip: Swing; loop: once; timeScale: 1.5');
      } else {
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
  },

  tick: function () {
    if (!this.data.isHeld && this.el.body) {
      let currentPos = this.el.object3D.position;
      if (currentPos.y < 0) {
        this.el.removeAttribute('ammo-body');
        this.el.setAttribute('position', {x: currentPos.x, y: 0.5, z: currentPos.z});
        setTimeout(() => {
          this.el.setAttribute('ammo-body', 'type: dynamic; mass: 5');
        }, 50);
      }
    }
  }
});
