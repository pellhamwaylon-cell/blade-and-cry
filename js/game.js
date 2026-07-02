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
  weapon.setAttribute('depth', '1');
  weapon.setAttribute('height', '0.05');
  weapon.setAttribute('width', '0.1');
  weapon.setAttribute('position', '0 2 -2');
  weapon.setAttribute('ammo-body', 'type: dynamic; mass: 10');
  weapon.setAttribute('weapon-weight', 'stiffness: 0.2');
  weapon.setAttribute('combat-weapon', 'type: sword; pcHoldPos: 0.3 -0.2 -0.6');
  scene.appendChild(weapon);
};

window.loadMap = function(mapId) {
  console.log(`Map loader triggered for: ${mapId}`);
  alert("Map database connected! Ready for .glb injections.");
};
