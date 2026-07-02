AFRAME.registerComponent('weapon-weight', {
  schema: {
    stiffness: { type: 'number', default: 0.3 } 
  },

  init: function () {
    this.isGrabbed = false;
    this.targetController = null;

    this.el.addEventListener('mousedown', (evt) => {
      const cursorEl = evt.detail.cursorEl;
      if (cursorEl.id === 'left-hand' || cursorEl.id === 'right-hand') {
        this.isGrabbed = true;
        this.targetController = cursorEl.object3D;
        this.el.setAttribute('ammo-body', 'gravity', '0 0 0');
      }
    });

    this.el.addEventListener('mouseup', () => {
      this.isGrabbed = false;
      this.targetController = null;
      this.el.setAttribute('ammo-body', 'gravity', '0 -9.8 0');
    });
  },

  tick: function (time, timeDelta) {
    if (!this.isGrabbed || !this.targetController) return;
    const bodyObj = this.el.body; 
    if (!bodyObj) return;

    const targetPos = this.targetController.position;
    const targetRot = this.targetController.quaternion;
    const currentPos = this.el.object3D.position;
    const currentRot = this.el.object3D.quaternion;

    currentPos.lerp(targetPos, this.data.stiffness);
    currentRot.slerp(targetRot, this.data.stiffness);

    const ammoTransform = new Ammo.btTransform();
    ammoTransform.setIdentity();
    ammoTransform.setOrigin(new Ammo.btVector3(currentPos.x, currentPos.y, currentPos.z));
    ammoTransform.setRotation(new Ammo.btQuaternion(currentRot.x, currentRot.y, currentRot.z, currentRot.w));
    
    bodyObj.setWorldTransform(ammoTransform);
  }
});
