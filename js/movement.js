AFRAME.registerComponent('player-movement', {
  init: function () {
    this.camera = document.querySelector('#head');
    this.bodyMesh = document.querySelector('#full-body-mesh'); // The placeholder body
    
    this.isCrouching = false;
    this.standHeight = 1.6;
    this.crouchHeight = 0.8;
    this.targetHeight = this.standHeight; // Where the camera WANTS to be
    this.currentHeight = this.standHeight;
    
    this.baseSpeed = 20;
    this.sprintSpeed = 50; 
    
    this.yVelocity = 0;
    this.isJumping = false;
    this.gravity = 0.01;

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') {
        this.camera.setAttribute('wasd-controls', `acceleration: ${this.sprintSpeed}`);
      }
      
      // CROUCH: Toggle target height
      if ((e.key === 'c' || e.key === 'C') && !this.isCrouching) {
        this.targetHeight = this.crouchHeight;
        this.isCrouching = true;
      }

      // JUMP: Only jump if we are on the ground (velocity is 0)
      if (e.key === ' ' && !this.isJumping && !this.isCrouching) {
        this.isJumping = true;
        this.yVelocity = 0.15; 
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        this.camera.setAttribute('wasd-controls', `acceleration: ${this.baseSpeed}`);
      }
      
      if (e.key === 'c' || e.key === 'C') {
        this.targetHeight = this.standHeight;
        this.isCrouching = false;
      }
    });
  },

  tick: function () {
    let pos = this.camera.getAttribute('position');

    // 1. SMOOTH CROUCHING (Lerp)
    // Moves 15% of the distance to the target height every frame
    this.currentHeight += (this.targetHeight - this.currentHeight) * 0.15;

    // 2. JUMPING & GRAVITY
    if (this.isJumping) {
      this.yVelocity -= this.gravity; 
    }

    // Apply heights
    let finalY = this.currentHeight + this.yVelocity;

    // Hit the ground
    if (finalY <= this.currentHeight) {
      finalY = this.currentHeight;
      this.isJumping = false;
      this.yVelocity = 0;
    }

    pos.y = finalY;
    this.camera.setAttribute('position', pos);

    // 3. SYNC FULL BODY MESH
    // Keeps the torso underneath the camera, but rotates with it
    if (this.bodyMesh) {
      let camRot = this.camera.getAttribute('rotation');
      // Position the body slightly lower than the eyes
      this.bodyMesh.setAttribute('position', `${pos.x} ${pos.y - 0.7} ${pos.z}`);
      // Only sync the Y-axis rotation (yaw) so the body doesn't tilt when you look up/down
      this.bodyMesh.setAttribute('rotation', `0 ${camRot.y} 0`);
    }
  }
});
