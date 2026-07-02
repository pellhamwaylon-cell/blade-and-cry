AFRAME.registerComponent('player-movement', {
  init: function () {
    this.rig = this.el;
    this.headLevel = document.querySelector('#head-level');
    this.bodyMesh = document.querySelector('#body-mesh');
    this.camera = document.querySelector('#head');
    
    this.isCrouching = false;
    this.standHeight = 1.6;
    this.crouchHeight = 0.8;
    this.targetHeight = this.standHeight;
    this.currentHeight = this.standHeight;
    
    this.baseSpeed = 0.15;
    this.sprintSpeed = 0.35;
    
    this.yVelocity = 0;
    this.isJumping = false;
    this.gravity = 0.01;

    window.addEventListener('keydown', (e) => {
      // Sprint
      if (e.key === 'Shift') this.rig.setAttribute('movement-controls', `speed: ${this.sprintSpeed}`);
      
      // Crouch Toggle
      if ((e.key === 'c' || e.key === 'C') && !this.isCrouching) {
        this.targetHeight = this.crouchHeight;
        this.isCrouching = true;
      }

      // Jump (Only if not crouching or already jumping)
      if (e.key === ' ' && !this.isJumping && !this.isCrouching) {
        this.isJumping = true;
        this.yVelocity = 0.15; 
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') this.rig.setAttribute('movement-controls', `speed: ${this.baseSpeed}`);
      if (e.key === 'c' || e.key === 'C') {
        this.targetHeight = this.standHeight;
        this.isCrouching = false;
      }
    });
  },

  tick: function () {
    // 1. Smooth Lerp
    this.currentHeight += (this.targetHeight - this.currentHeight) * 0.15;

    // 2. Jump Physics
    if (this.isJumping) this.yVelocity -= this.gravity;
    let finalY = this.currentHeight + this.yVelocity;

    if (finalY <= this.currentHeight) {
      finalY = this.currentHeight;
      this.isJumping = false;
      this.yVelocity = 0;
    }

    // 3. Apply ONLY to Head Level (Fixes Teleport Bug!)
    this.headLevel.setAttribute('position', `0 ${finalY} 0`);

    // 4. Procedural Body Sync & Squish
    if (this.bodyMesh) {
      let crouchRatio = finalY / this.standHeight; 
      
      // Torso & Arms move down
      document.querySelector('#torso').setAttribute('position', `0 ${finalY - 0.6} 0`);
      document.querySelector('#arm-l').setAttribute('position', `-0.28 ${finalY - 0.6} 0`);
      document.querySelector('#arm-r').setAttribute('position', `0.28 ${finalY - 0.6} 0`);
      
      // Legs squish
      document.querySelector('#leg-l').setAttribute('scale', `1 ${crouchRatio} 1`);
      document.querySelector('#leg-r').setAttribute('scale', `1 ${crouchRatio} 1`);
      document.querySelector('#leg-l').setAttribute('position', `-0.12 ${(0.7 * crouchRatio) / 2} 0`);
      document.querySelector('#leg-r').setAttribute('position', `0.12 ${(0.7 * crouchRatio) / 2} 0`);

      // Match body rotation to camera yaw
      let camY = this.camera.getAttribute('rotation').y;
      this.bodyMesh.setAttribute('rotation', `0 ${camY} 0`);
    }
  }
});
