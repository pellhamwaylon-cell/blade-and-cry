AFRAME.registerComponent('player-movement', {
  init: function () {
    this.rig = this.el;
    this.headLevel = document.querySelector('#head-level');
    this.camera = document.querySelector('#head');
    this.cursor = document.querySelector('#pc-cursor');
    
    // Viewmodel Arms
    this.armL = document.querySelector('#vm-arm-l');
    this.armR = document.querySelector('#vm-arm-r');
    
    this.standHeight = 1.6;
    this.crouchHeight = 0.8;
    this.currentHeight = this.standHeight;
    this.targetHeight = this.standHeight;
    
    this.isSprinting = false;
    this.isJumping = false;
    this.yVelocity = 0;
    this.isMoving = false;
    this.bobTimer = 0;

    window.addEventListener('keydown', (e) => {
      let k = e.key.toLowerCase();
      if (['w','a','s','d'].includes(k)) this.isMoving = true;
      
      if (k === 'shift') {
        this.isSprinting = true;
        this.rig.setAttribute('movement-controls', `speed: 0.35`);
      }
      if (k === 'c') this.targetHeight = this.crouchHeight;
      if (e.key === ' ' && !this.isJumping) { this.isJumping = true; this.yVelocity = 0.15; }
    });

    window.addEventListener('keyup', (e) => {
      let k = e.key.toLowerCase();
      if (['w','a','s','d'].includes(k)) this.isMoving = false;
      if (k === 'shift') {
        this.isSprinting = false;
        this.rig.setAttribute('movement-controls', `speed: 0.15`);
      }
      if (k === 'c') this.targetHeight = this.standHeight;
    });
  },

  tick: function (time, delta) {
    this.currentHeight += (this.targetHeight - this.currentHeight) * 0.15;

    // CLIMBING LOGIC (Checks if facing a wall)
    let isClimbing = false;
    if (this.isMoving && this.cursor.components.raycaster) {
      let intersections = this.cursor.components.raycaster.intersections;
      if (intersections.length > 0 && intersections[0].distance < 1.2) {
        if (intersections[0].object.el.classList.contains('climbable')) {
           isClimbing = true;
           this.yVelocity = 0.05; // Force rig upwards
           this.isJumping = true; // Suspend gravity
        }
      }
    }

    if (this.isJumping && !isClimbing) this.yVelocity -= 0.01; // Gravity
    
    let finalY = this.currentHeight + this.yVelocity;
    if (finalY <= this.currentHeight && !isClimbing) {
      finalY = this.currentHeight;
      this.isJumping = false;
      this.yVelocity = 0;
    }

    // ARM SPRINT ANIMATION
    if (this.isSprinting && this.isMoving) {
      this.bobTimer += delta * 0.015;
      let armPump = Math.sin(this.bobTimer) * 20;
      this.armL.setAttribute('rotation', `${-40 + armPump} 10 0`);
      this.armR.setAttribute('rotation', `${-20 - armPump} -10 0`);
    } else {
      // Reset to natural rest
      this.armL.setAttribute('rotation', `-40 10 0`);
      this.armR.setAttribute('rotation', `-20 -10 0`);
    }

    this.headLevel.setAttribute('position', `0 ${finalY} 0`);

    // Sync 3rd Person Body
    let body = document.querySelector('#body-mesh');
    if (body) {
      let camY = this.camera.getAttribute('rotation').y;
      body.setAttribute('rotation', `0 ${camY} 0`);
      document.querySelector('#torso').setAttribute('position', `0 ${finalY - 0.6} 0`);
      if(document.querySelector('#equipped-armor').getAttribute('visible')) {
        document.querySelector('#equipped-armor').setAttribute('position', `0 ${finalY - 0.6} 0`);
      }
    }
  }
});
