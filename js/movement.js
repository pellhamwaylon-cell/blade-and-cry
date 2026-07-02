AFRAME.registerComponent('player-movement', {
  init: function () {
    this.rig = this.el;
    this.headLevel = document.querySelector('#head-level');
    this.bodyMesh = document.querySelector('#body-mesh');
    this.camera = document.querySelector('#head');
    
    this.standHeight = 1.6;
    this.crouchHeight = 0.8;
    this.targetHeight = this.standHeight;
    this.currentHeight = this.standHeight;
    
    this.isCrouching = false;
    this.isJumping = false;
    this.yVelocity = 0;
    
    // Bobbing variables
    this.isMoving = false;
    this.bobTimer = 0;

    window.addEventListener('keydown', (e) => {
      let k = e.key.toLowerCase();
      if (['w','a','s','d'].includes(k)) this.isMoving = true;
      if (k === 'shift') this.rig.setAttribute('movement-controls', `speed: 0.35`);
      
      if (k === 'c' && !this.isCrouching) {
        this.targetHeight = this.crouchHeight;
        this.isCrouching = true;
      }
      if (e.key === ' ' && !this.isJumping && !this.isCrouching) {
        this.isJumping = true;
        this.yVelocity = 0.15; 
      }
    });

    window.addEventListener('keyup', (e) => {
      let k = e.key.toLowerCase();
      if (['w','a','s','d'].includes(k)) this.isMoving = false;
      if (k === 'shift') this.rig.setAttribute('movement-controls', `speed: 0.15`);
      if (k === 'c') {
        this.targetHeight = this.standHeight;
        this.isCrouching = false;
      }
    });
  },

  tick: function (time, delta) {
    // 1. Crouch Lerp
    this.currentHeight += (this.targetHeight - this.currentHeight) * 0.15;

    // 2. Jump Physics
    if (this.isJumping) this.yVelocity -= 0.01;
    let finalY = this.currentHeight + this.yVelocity;
    if (finalY <= this.currentHeight) {
      finalY = this.currentHeight;
      this.isJumping = false;
      this.yVelocity = 0;
    }

    // 3. Head Bobbing (Only when moving and on ground)
    let bobOffset = 0;
    if (this.isMoving && !this.isJumping) {
      this.bobTimer += delta * 0.01;
      bobOffset = Math.sin(this.bobTimer) * 0.05; // 0.05 is the intensity of the bob
    }

    // Apply height + bob to head level
    this.headLevel.setAttribute('position', `0 ${finalY + bobOffset} 0`);

    // 4. Sync Body Rotation
    if (this.bodyMesh) {
      let camY = this.camera.getAttribute('rotation').y;
      this.bodyMesh.setAttribute('rotation', `0 ${camY} 0`);
      
      // Squish legs logic
      let crouchRatio = finalY / this.standHeight;
      document.querySelector('#torso').setAttribute('position', `0 ${finalY - 0.6} 0`);
      document.querySelector('#equipped-armor').setAttribute('position', `0 ${finalY - 0.6} 0`);
    }
  }
});
