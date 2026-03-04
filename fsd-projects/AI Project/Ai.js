// Game State
const player = { 
    name: "Hero", hp: 100, maxHp: 100, attack: 15, gold: 0, 
    hasSword: false // Special Item toggle
};

let enemy = { name: "Goblin", hp: 80, maxHp: 80, attack: 12 };
let isPlayerTurn = true;
let enemyLevel = 1;

// --- Improved Monster Scaling Data ---
      const monsters = [
        { name: "Slime", sprite: "💧", hpWeight: 1.4, atkWeight: 0.7, goldWeight: 0.9 },
        { name: "Skeleton", sprite: "💀", hpWeight: 1.0, atkWeight: 1.2, goldWeight: 1.1 },
        { name: "Orc", sprite: "🧌", hpWeight: 1.2, atkWeight: 1.5, goldWeight: 1.3 },
        { name: "Wraith", sprite: "👻", hpWeight: 0.8, atkWeight: 2.0, goldWeight: 1.5 },
        { name: "Golem", sprite: "🗿", hpWeight: 2.5, atkWeight: 0.9, goldWeight: 1.8 }
      ];

      function nextRound() {
        document.getElementById("shop-screen").classList.add("hidden");
        round++;
        
        // Pick a random monster template
        const m = monsters[Math.floor(Math.random() * monsters.length)];
        
        // Difficulty Multiplier
        const diffScale = difficulty === "Hard" ? 1.4 : (difficulty === "Easy" ? 0.7 : 1.0);
        
        // BOSS FACTOR: Every 5 rounds, stats jump significantly
        const bossFactor = (round % 5 === 0) ? 1.5 : 1.0;
        const bossPrefix = (round % 5 === 0) ? "ELITE " : "";

        /* SCALING FORMULA: 
           Base * (Growth ^ Round) * MonsterWeight * Difficulty
        */
        const growthBase = 1.12; // 12% increase per round compounded
        const scaleFactor = Math.pow(growthBase, round);

        enemy = {
          name: bossPrefix + m.name,
          sprite: (round % 5 === 0) ? "👺" : m.sprite,
          hp: Math.floor(70 * scaleFactor * m.hpWeight * diffScale * bossFactor),
          attack: Math.floor(10 * scaleFactor * m.atkWeight * diffScale * bossFactor),
          blocking: false
        };
        
        // Set Max HP for the bar calculation
        enemy.maxHp = enemy.hp;
        
        document.getElementById("battle-screen").classList.remove("hidden");
        player.mana = player.maxMana; // Restore mana between rounds
        isPlayerTurn = true;
        toggleBtns(true);
        updateUI();
        
        logMessage(`<b style="color:#e74c3c">ROUND ${round}: A ${enemy.name} approaches!</b>`);
      }

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