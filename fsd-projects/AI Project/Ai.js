// Game State
const player = { 
    name: "Hero", hp: 100, maxHp: 100, attack: 15, gold: 0, 
    hasSword: false // Special Item toggle
};

let enemy = { name: "Goblin", hp: 80, maxHp: 80, attack: 12 };
let isPlayerTurn = true;
let enemyLevel = 1;

// Add sprites to your monster types
const monsterTypes = [
    { name: "Slime", sprite: "💧", hpMult: 0.8, atkMult: 0.7, color: "#2ecc71" },
    { name: "Goblin", sprite: "👺", hpMult: 1.0, atkMult: 1.0, color: "#d35400" },
    { name: "Skeleton", sprite: "💀", hpMult: 1.2, atkMult: 1.1, color: "#ecf0f1" },
    { name: "Orc", sprite: "👹", hpMult: 1.5, atkMult: 1.3, color: "#27ae60" },
    { name: "Ghost", sprite: "👻", hpMult: 0.9, atkMult: 1.5, color: "#9b59b6" }
];

function updateUI() {
    document.getElementById('player-hp').style.width = (player.hp / player.maxHp * 100) + "%";
    document.getElementById('enemy-hp').style.width = (enemy.hp / enemy.maxHp * 100) + "%";
    document.getElementById('player-hp-text').innerText = `${player.hp} / ${player.maxHp} HP`;
    document.getElementById('enemy-hp-text').innerText = `${enemy.hp} / ${enemy.maxHp} HP`;
    document.getElementById('gold-count').innerText = player.gold;
    
    // Disable sword button if already owned
    if(player.hasSword) {
        document.getElementById('special-item-btn').disabled = true;
        document.getElementById('special-item-btn').innerText = "Sword Equipped (2x DMG)";
    }
}

function handleTurn(action) {
    if (!isPlayerTurn) return;
    toggleButtons(false);

    if (action === 'attack') {
        let baseDmg = player.attack * (0.8 + Math.random() * 0.4);
        // Apply Special Item multiplier
        if (player.hasSword) baseDmg *= 2; 
        
        const dmg = Math.floor(baseDmg);
        enemy.hp = Math.max(0, enemy.hp - dmg);
        logMessage(`You hit the ${enemy.name} for ${dmg} damage!`);
        animate('enemy-sprite');
    } else if (action === 'heal') {
        const heal = 25;
        player.hp = Math.min(player.maxHp, player.hp + heal);
        logMessage(`You healed for ${heal} HP!`);
    }

    updateUI();
    if (enemy.hp <= 0) winBattle();
    else { isPlayerTurn = false; setTimeout(enemyTurn, 1000); }
}

function buyUpgrade(type) {
    if (type === 'attack' && player.gold >= 10) {
        player.gold -= 10; player.attack += 5;
        logMessage("Attack Upgraded!");
    } else if (type === 'hp' && player.gold >= 15) {
        player.gold -= 15; player.maxHp += 20; player.hp = player.maxHp;
        logMessage("Max HP Upgraded!");
    } else if (type === 'sword' && player.gold >= 50) {
        player.gold -= 50;
        player.hasSword = true;
        logMessage("<b>YOU BOUGHT THE ENCHANTED SWORD! Damage is now DOUBLED!</b>");
    } else {
        logMessage("Not enough gold!");
    }
    updateUI();
}

function nextRound() {
    enemyLevel++;
    
    // Pick a random monster type
    const type = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    
    // Set boss every 7 rounds
    if (enemyLevel % 7 === 0) {
        enemy = {
            name: "DRAGON BOSS",
            hp: Math.floor(200 + (enemyLevel * 20)),
            maxHp: Math.floor(200 + (enemyLevel * 20)),
            attack: Math.floor(25 + (enemyLevel * 4))
        };
    } else {
        enemy = {
            name: type.name,
            hp: Math.floor((80 + (enemyLevel * 10)) * type.hpMult),
            maxHp: Math.floor((80 + (enemyLevel * 10)) * type.hpMult),
            attack: Math.floor((10 + (enemyLevel * 2)) * type.atkMult)
        };
    }
    
    // Change enemy name color based on type
    document.getElementById('enemy-sprite').querySelector('h2').innerText = enemy.name;
    document.getElementById('enemy-sprite').querySelector('h2').style.color = type.color || "white";
    
    document.getElementById('shop-screen').style.display = 'none';
    logMessage(`--- Round ${enemyLevel}: A ${enemy.name} appears! ---`);
    isPlayerTurn = true;
    toggleButtons(true);
    updateUI();
}

// ... (keep toggleButtons, logMessage, animate, and enemyTurn from previous version)