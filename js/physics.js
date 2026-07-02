AFRAME.registerComponent('weapon-weight', {
  schema: {
    stiffness: { type: 'number', default: 0.3 } // Lower = heavier/laggier
  },

  init: function () {
    this.isGrabbed = false;
    this.targetController = null;

    // Listen for VR controller trigger squeeze (using standard A-Frame laser-controls)
    this.el.addEventListener('mousedown', (evt) => {
      // Find out which hand clicked the weapon
      const cursorEl = evt.detail.cursorEl;
      if (cursorEl.id === 'left-hand' || cursorEl.id === 'right-hand') {
        this.isGrabbed = true;
        this.targetController = cursorEl.object3D;
        
        // Remove standard gravity while held so you don't fight it
        this.el.setAttribute('ammo-body', 'gravity', '0 0 0');
      }
    });

    this.el.addEventListener('mouseup', () => {
      this.isGrabbed = false;
      this.targetController = null;
      // Restore gravity when dropped
      this.el.setAttribute('ammo-body', 'gravity', '0 -9.8 0');
    });
  },

  tick: function (time, timeDelta) {
    if (!this.isGrabbed || !this.targetController) return;

    // The weapon's current physical body
    const bodyObj = this.el.body; 
    if (!bodyObj) return;

    // Get where the physical VR controller is right now
    const targetPos = this.targetController.position;
    const targetRot = this.targetController.quaternion;

    // Get where the sword is right now
    const currentPos = this.el.object3D.position;
    const currentRot = this.el.object3D.quaternion;

    // INTERPOLATION (The Weight Logic)
    // Instead of snapping the sword to the hand, move it *partway* there every frame.
    // This creates inertia. If stiffness is 0.1, it moves 10% of the distance per frame.
    currentPos.lerp(targetPos, this.data.stiffness);
    currentRot.slerp(targetRot, this.data.stiffness);

    // Apply the newly calculated "lagging" position to the Ammo.js physics body
    // This allows the sword to hit walls and bounce back naturally
    const ammoTransform = new Ammo.btTransform();
    ammoTransform.setIdentity();
    ammoTransform.setOrigin(new Ammo.btVector3(currentPos.x, currentPos.y, currentPos.z));
    ammoTransform.setRotation(new Ammo.btQuaternion(currentRot.x, currentRot.y, currentRot.z, currentRot.w));
    
    // Update the physics engine
    bodyObj.setWorldTransform(ammoTransform);
  }
});
