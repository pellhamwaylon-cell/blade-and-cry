document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector('a-scene');
  const pcCursor = document.querySelector('#pc-cursor');
  const leftHand = document.querySelector('#left-hand');
  const rightHand = document.querySelector('#right-hand');
  const modeBadge = document.querySelector('#mode-badge');
  const uiLayer = document.querySelector('#ui-layer');

  scene.addEventListener('enter-vr', function () {
    modeBadge.innerText = "[VR MODE]";
    uiLayer.style.display = 'none'; 
    pcCursor.setAttribute('visible', 'false');
    pcCursor.removeAttribute('cursor');
    leftHand.setAttribute('visible', 'true');
    rightHand.setAttribute('visible', 'true');
  });

  scene.addEventListener('exit-vr', function () {
    modeBadge.innerText = "[PC MODE]";
    uiLayer.style.display = 'block'; 
    pcCursor.setAttribute('visible', 'true');
    pcCursor.setAttribute('cursor', 'rayOrigin: entity');
    leftHand.setAttribute('visible', 'false');
    rightHand.setAttribute('visible', 'false');
  });
});

window.spawnWeapon = function() {
  const scene = document.querySelector('a-scene');
  const weapon = document.createElement('a-box');
  
  weapon.setAttribute('class', 'clickable');
  weapon.setAttribute('color', 'gold');
  weapon.setAttribute('depth', '0.8');
  weapon.setAttribute('height', '0.05');
  weapon.setAttribute('width', '0.1');
  weapon.setAttribute('position', '0 2 -2');
  weapon.setAttribute('ammo-body', 'type: dynamic; mass: 10');
  
  // Set up the modder components for the spawned weapon
  weapon.setAttribute('combat-weapon', 'name: Golden Blade; type: sword; vrGrabMode: force; pcHoldPos: 0.3 -0.2 -0.6');
  
  // Create hover text
  const text = document.createElement('a-text');
  text.setAttribute('class', 'hover-text');
  text.setAttribute('value', 'Golden Blade');
  text.setAttribute('align', 'center');
  text.setAttribute('position', '0 0.2 0');
  text.setAttribute('scale', '0.5 0.5 0.5');
  text.setAttribute('visible', 'false');
  text.setAttribute('color', 'gold');
  text.setAttribute('look-at', '#head');
  
  weapon.appendChild(text);
  scene.appendChild(weapon);
};
