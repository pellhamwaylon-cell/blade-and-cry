document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector('a-scene');
  const pcCursor = document.querySelector('#pc-cursor');
  const leftHand = document.querySelector('#left-hand');
  const rightHand = document.querySelector('#right-hand');
  const modeBadge = document.querySelector('#mode-badge');
  const uiLayer = document.querySelector('#ui-layer');

  // TRIGGER: When the user puts on the headset
  scene.addEventListener('enter-vr', function () {
    modeBadge.innerText = "[VR MODE]";
    uiLayer.style.display = 'none'; // Hide 2D HTML menu
    
    // Disable PC crosshair, enable VR hands
    pcCursor.setAttribute('visible', 'false');
    pcCursor.removeAttribute('cursor');
    
    leftHand.setAttribute('visible', 'true');
    rightHand.setAttribute('visible', 'true');
  });

  // TRIGGER: When the user takes off the headset
  scene.addEventListener('exit-vr', function () {
    modeBadge.innerText = "[PC MODE]";
    uiLayer.style.display = 'block'; 
    
    pcCursor.setAttribute('visible', 'true');
    pcCursor.setAttribute('cursor', 'rayOrigin: entity');
    
    leftHand.setAttribute('visible', 'false');
    rightHand.setAttribute('visible', 'false');
  });
});

// Extensible Modding Logic
window.spawnWeapon = function() {
  const scene = document.querySelector('a-scene');
  const weapon = document.createElement('a-entity');
  // You can fetch URLs from a JSON database here to load custom 3D models
  weapon.setAttribute('mixin', 'heavy-metal');
  weapon.setAttribute('geometry', 'primitive: box; depth: 1; height: 0.05; width: 0.1');
  weapon.setAttribute('position', '0 2 -2');
  weapon.setAttribute('class', 'clickable');
  scene.appendChild(weapon);
};
