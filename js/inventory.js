// THE MOD DATABASE (Easily extensible)
const ModDB = {
  Swords: [
    { id: 'sword_buster', name: 'The Buster', color: 'silver', type: 'weapon', size: '1 0.05 0.1' },
    { id: 'sword_cyber', name: 'Cyber Katana', color: 'cyan', type: 'weapon', size: '1.2 0.02 0.05' }
  ],
  Daggers: [
    { id: 'dagger_rogue', name: 'Rogue Dagger', color: '#444', type: 'weapon', size: '0.4 0.02 0.05' }
  ],
  Armor: [
    { id: 'armor_plate', name: 'Iron Chestplate', color: '#aaa', type: 'armor' },
    { id: 'armor_gold', name: 'Gold Trim', color: 'gold', type: 'armor' }
  ]
};

let currentCategory = 'Swords';

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderItems();
  loadSavedLoadout(); // Load from browser storage

  // Toggle book with TAB
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      toggleBook();
    }
  });
});

window.toggleBook = function() {
  const book = document.getElementById('spawn-book');
  const isHidden = book.classList.contains('hidden');
  if (isHidden) {
    document.exitPointerLock(); // Free the mouse
    book.classList.remove('hidden');
  } else {
    book.classList.add('hidden');
  }
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
    card.innerHTML = `<div style="width:40px;height:40px;background:${item.color};margin:0 auto 10px;"></div><b>${item.name}</b>`;
    card.onclick = () => { equipItem(item); toggleBook(); };
    container.appendChild(card);
  });
}

// Equip & Save Logic
window.equipItem = function(item) {
  if (item.type === 'weapon') {
    // Clear current grip
    const pcGrip = document.querySelector('#pc-grip');
    pcGrip.innerHTML = '';
    
    // Create new weapon
    let w = document.createElement('a-box');
    let [d, h, w_size] = item.size.split(' ');
    w.setAttribute('depth', d); w.setAttribute('height', h); w.setAttribute('width', w_size);
    w.setAttribute('color', item.color);
    w.setAttribute('combat-weapon', `type: sword`);
    
    pcGrip.appendChild(w);
    
    // Save to LocalStorage
    localStorage.setItem('bladeAndCry_weapon', JSON.stringify(item));
  }
  
  if (item.type === 'armor') {
    const armorMesh = document.querySelector('#equipped-armor');
    armorMesh.setAttribute('color', item.color);
    armorMesh.setAttribute('visible', 'true');
    localStorage.setItem('bladeAndCry_armor', JSON.stringify(item));
  }
};

function loadSavedLoadout() {
  let savedWep = localStorage.getItem('bladeAndCry_weapon');
  if (savedWep) equipItem(JSON.parse(savedWep));
  
  let savedArmor = localStorage.getItem('bladeAndCry_armor');
  if (savedArmor) equipItem(JSON.parse(savedArmor));
}
