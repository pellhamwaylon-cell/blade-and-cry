AFRAME.registerComponent('combat-weapon', {
  schema: {
    name: { type: 'string', default: 'Unknown Weapon' },
    type: { type: 'string', default: 'sword' }, 
    isHeld: { type: 'boolean', default: false },
    
    // VR Settings
    vrGrabMode: { type: 'string', default: 'force' }, // 'force' (teleport) or 'physical' (bend down)
    vrGripPos: { type: 'vec3', default: {x: 0, y: 0, z: 0} }, // Where the hand grips it
    vrGripRot: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    
    // PC Settings
    pcHoldPos: { type: 'vec3', default: {x: 0.4, y: -0.3, z: -0.7} },
    pcHoldRot: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    swingRot: { type: 'vec3', default: {x: -60, y: 45, z: -45} } 
  },

  init: function () {
    this.mode = 'pc'; 
    this.camera = document.querySelector('#head');
    this.hoverText = this.el.querySelector('.hover-text');
    
    // Hover over weapon
    this.el.addEventListener('mouseenter', () => {
      if (!this.data.isHeld && this.hoverText) {
        this.hoverText.setAttribute('visible', 'true');
      }
    });

    // Look away from weapon
    this.el.addEventListener('mouseleave', () => {
      if (this.hoverText) {
        this.hoverText.setAttribute('visible', 'false');
      }
    });
    
    // Pick up weapon
    this.el.addEventListener('click', (evt) => {
      if (!this.data.isHeld) {
        // If physical mode is on, check distance to controller
        if (this.el.sceneEl.is('vr-mode') && this.data.vrGrabMode === 'physical') {
           // Logic to ensure hand is physically close would go here
           this.equipWeapon(evt.detail.cursorEl);
        } else {
           // Force grab (teleport to hand/screen)
           this.equipWeapon(evt.detail.cursorEl);
        }
      }
    });

    // Swing weapon on PC
    document.querySelector('a-scene').addEventListener('mousedown', () => {
      if (this.data.isHeld && this.mode === 'pc') {
        this.triggerAction();
      }
    });
  },

  equipWeapon: function (handEl) {
    this.data.isHeld = true;
    if (this.hoverText) this.hoverText.setAttribute('visible', 'false');

    if (this.el.sceneEl.is('vr-mode')) {
      this.mode = 'vr';
      this.el.removeAttribute('ammo-body'); // Optional: replace with physics joints later
      handEl.appendChild(this.el);
      // Apply modder's custom grip offset
      this.el.setAttribute('position', this.data.vrGripPos);
      this.el.setAttribute('rotation', this.data.vrGripRot);
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
