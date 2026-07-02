AFRAME.registerComponent('player-movement', {
  init: function () {
    this.camera = document.querySelector('#head');
    this.isCrouching = false;
    this.baseHeight = 1.6;
    this.crouchHeight = 0.8;
    this.baseSpeed = 50;
    this.sprintSpeed = 120;
    
    this.velocity = 0;
    this.isJumping = false;

    window.addEventListener('keydown', (e) => {
      // SPRINT
      if (e.key === 'Shift') {
        this.camera.setAttribute('wasd-controls', `acceleration: ${this.sprintSpeed}`);
      }
      
      // CROUCH
      if (e.key === 'c' || e.key === 'C' || e.key === 'Control') {
        if (!this.isCrouching) {
          this.camera.setAttribute('position', `0 ${this.crouchHeight} 0`);
          this.isCrouching = true;
        }
      }

      // JUMP (Basic logic for flat terrain)
      if (e.key === ' ' && !this.isJumping) {
        this.isJumping = true;
        this.velocity = 0.15; // Jump strength
      }
    });

    window.addEventListener('keyup', (e) => {
      // STOP SPRINTING
      if (e.key === 'Shift') {
        this.camera.setAttribute('wasd-controls', `acceleration: ${this.baseSpeed}`);
      }
      
      // STOP CROUCHING
      if (e.key === 'c' || e.key === 'C' || e.key === 'Control') {
        this.camera.setAttribute('position', `0 ${this.baseHeight} 0`);
        this.isCrouching = false;
      }
    });
  },

  tick: function () {
    // Simple gravity loop for jumping
    if (this.isJumping) {
      let pos = this.camera.getAttribute('position');
      pos.y += this.velocity;
      this.velocity -= 0.01; // Gravity pull

      if (pos.y <= this.baseHeight) {
        pos.y = this.baseHeight;
        this.isJumping = false;
      }
      this.camera.setAttribute('position', pos);
    }
  }
});
