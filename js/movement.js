AFRAME.registerComponent('player-movement', {
  init: function () {
    this.camera = document.querySelector('#head');
    this.isCrouching = false;
    this.baseHeight = 1.6;
    this.crouchHeight = 0.8;
    
    // Adjusted speeds so you don't zoom out of bounds
    this.baseSpeed = 20;
    this.sprintSpeed = 50; 
    
    this.velocity = 0;
    this.isJumping = false;

    window.addEventListener('keydown', (e) => {
      // SPRINT
      if (e.key === 'Shift') {
        this.camera.setAttribute('wasd-controls', `acceleration: ${this.sprintSpeed}`);
      }
      
      // CROUCH (ONLY using 'C' now so it doesn't close your browser tabs!)
      if (e.key === 'c' || e.key === 'C') {
        if (!this.isCrouching) {
          this.camera.setAttribute('position', `0 ${this.crouchHeight} 0`);
          this.isCrouching = true;
        }
      }

      // JUMP
      if (e.key === ' ' && !this.isJumping) {
        this.isJumping = true;
        this.velocity = 0.15; // Jump strength
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        this.camera.setAttribute('wasd-controls', `acceleration: ${this.baseSpeed}`);
      }
      
      if (e.key === 'c' || e.key === 'C') {
        this.camera.setAttribute('position', `0 ${this.baseHeight} 0`);
        this.isCrouching = false;
      }
    });
  },

  tick: function () {
    if (this.isJumping) {
      let pos = this.camera.getAttribute('position');
      pos.y += this.velocity;
      this.velocity -= 0.01; 

      if (pos.y <= this.baseHeight) {
        pos.y = this.baseHeight;
        this.isJumping = false;
      }
      this.camera.setAttribute('position', pos);
    }
  }
});
