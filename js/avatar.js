AFRAME.registerComponent('full-body-ik', {
  schema: {
    head: { type: 'selector' },
    leftHand: { type: 'selector' },
    rightHand: { type: 'selector' }
  },

  init: function () {
    this.bones = {};
    
    // Wait for the 3D model (.glb) to load
    this.el.addEventListener('model-loaded', () => {
      const mesh = this.el.getObject3D('mesh');
      if (!mesh) return;
      
      // Traverse the 3D model to find the bones
      mesh.traverse((node) => {
        if (node.isBone) {
          // These names depend on how you rig your model in Blender (e.g., Mixamo rigs)
          if (node.name === 'mixamorigHead') this.bones.head = node;
          if (node.name === 'mixamorigLeftHand') this.bones.leftHand = node;
          if (node.name === 'mixamorigRightHand') this.bones.rightHand = node;
        }
      });
      this.el.setAttribute('visible', 'true');
    });
  },

  tick: function () {
    if (!this.bones.head) return; // Wait until model is ready

    // Sync Avatar Head to VR Camera
    if (this.data.head) {
      this.bones.head.position.copy(this.data.head.object3D.position);
      this.bones.head.quaternion.copy(this.data.head.object3D.quaternion);
    }
    
    // Sync Avatar Hands to VR Controllers
    if (this.data.leftHand && this.bones.leftHand) {
      this.bones.leftHand.position.copy(this.data.leftHand.object3D.position);
      this.bones.leftHand.quaternion.copy(this.data.leftHand.object3D.quaternion);
    }
    
    if (this.data.rightHand && this.bones.rightHand) {
      this.bones.rightHand.position.copy(this.data.rightHand.object3D.position);
      this.bones.rightHand.quaternion.copy(this.data.rightHand.object3D.quaternion);
    }
  }
});
