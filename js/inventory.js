const ModDB = {
  Swords: [
    { id: 'sword_buster', name: 'Buster', color: 'silver', type: 'weapon', size: '0.1 0.05 0.8', hiltOffset: '0 0 0.3' },
    { id: 'sword_cyber', name: 'Cyber Katana', color: 'cyan', type: 'weapon', size: '0.05 0.02 1', hiltOffset: '0 0 0.4' }
  ],
  Ranged: [
    { id: 'dagger_throw', name: 'Throwing Knife', color: '#444', type: 'weapon', size: '0.05 0.02 0.3', hiltOffset: '0 0 0.1' },
    { id: 'bow_wood', name: 'Longbow', color: '#8b4513', type: 'weapon', size: '0.05 1 0.05', hiltOffset: '0 0 0' }
  ],
  Armor: [
    { id: 'armor_plate', name: 'Iron Plate', color: '#aaa', type: 'armor' },
    { id: 'armor_none', name: 'UNEQUIP ARMOR', color: 'transparent', type: 'armor' } // Let's you take it off
  ],
  Maps: [
    { id: 'map_colosseum', name: 'Colosseum', type: 'map' },
    { id: 'map_house', name: 'House', type: 'map' }
  ]
};

let currentCategory = 'Swords';
let hotbar = [null, null, null]; // 3 Slots
let selectedSlot = 0;

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderItems();
  updateHotbarUI();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); toggleBook(); }
  });

  // SCROLL WHEEL TO SWITCH WEAPONS
  window.addEventListener('wheel', (e) => {
    if (document.getElementById('spawn-book').classList.contains('hidden')) {
      if (e.deltaY > 0) selectedSlot = (selectedSlot + 1) % 3;
      else selectedSlot = (selectedSlot - 1 + 3) % 3;
      updateHotbarUI();
      renderEquippedWeapon();
    }
  });
});

window.toggleBook = function() {
  const book = document.getElementById('spawn-book');
  if (book.classList.contains('hidden')) {
    document.exitPointerLock(); 
    book.classList.remove('hidden');
  } else book.classList.add('hidden');
};

function renderCategories() {
  const container = document.getElementById('book-categories');
  container.innerHTML = '';
  Object.keys(ModDB).forEach(cat => {
    let btn = document.createElement('button');
    btn.className = `cat-btn ${cat === currentCategory ? 'active' : ''}`;
    btn.innerText = cat;
    btn.onclick = () => { currentCategory = cat; renderCategories(); renderItems(); };
    container.appendChild(btn);
  });
}

function renderItems() {
  const container = document.getElementById('book-items');
  container.innerHTML = '';
  ModDB[currentCategory].forEach(item => {
    let card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `<b>${item.name}</b>`;
    card.onclick = () => { equipItem(item); };
    container.appendChild(card);
  });
}

function updateHotbarUI() {
  const container = document.getElementById('hotbar-ui');
  container.innerHTML = '';
  for(let i=0; i<3; i++) {
    let slot = document.createElement('div');
    slot.className = `hotbar-slot ${i === selectedSlot ? 'active' : ''}`;
    slot.innerText = hotbar[i] ? hotbar[i].name : `Slot ${i+1}`;
    container.appendChild(slot);
  }
}

window.equipItem = function(item) {
  if (item.type === 'weapon') {
    hotbar[selectedSlot] = item;
    updateHotbarUI();
    renderEquippedWeapon();
  }
  
  if (item.type === 'armor') {
    const armorMesh = document.querySelector('#equipped-armor');
    if(item.id === 'armor_none') {
      armorMesh.setAttribute('visible', 'false');
    } else {
      armorMesh.setAttribute('color', item.color);
      armorMesh.setAttribute('visible', 'true');
    }
  }

  if (item.type === 'map') {
    document.querySelectorAll('.map-instance').forEach(m => m.setAttribute('visible', 'false'));
    document.getElementById(item.id).setAttribute('visible', 'true');
  }
};

function renderEquippedWeapon() {
  const pcGrip = document.querySelector('#pc-grip');
  pcGrip.innerHTML = ''; // Clear hands
  
  let item = hotbar[selectedSlot];
  if (!item) return;

  let w = document.createElement('a-box');
  let [w_width, h, d] = item.size.split(' ');
  w.setAttribute('width', w_width); w.setAttribute('height', h); w.setAttribute('depth', d);
  w.setAttribute('color', item.color);
  
  // Hilt offset so you grab the handle, not the blade
  w.setAttribute('position', item.hiltOffset);
  w.setAttribute('combat-weapon', `type: sword`);
  pcGrip.appendChild(w);
}
