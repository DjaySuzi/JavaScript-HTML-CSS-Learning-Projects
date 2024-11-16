//Initialized var. Match html stat span displays
let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
//Declared var but not initilialized
let fighting;
let monsterHealth;
let inventory = ["stick"];

//DOM - document object to access HTML document - .querySelector() method to take CSS selector as argument and return first element that matches that selector. Used # for id
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
//monsterHealth var already declared. Added 'Text' to avoid redundancy
const monsterHealthText = document.querySelector("#monsterHealth");

//weapons array will hold different weapons. Each weapon is an object.
const weapons = [
  {name: "stick", power: 5},
  {name: "dagger", power: 30},
  {name: "claw hammer", power: 50},
  {name: "sword", power: 100}
];

//monsters array. Each object has name, level, and health
const monsters = [
  {name: "slime", level: 2, health: 15},
  {name: "fanged beast", level: 8, health: 60},
  {name: "dragon", level: 20, health: 300}
];

//locations array will hold the store, cave, and town square. Each location is an object.
const locations = [
  {name: "town square",
  //array of 3 strings assigned to the button innerText properties in goTown
  "button text": ["Go to store", "Go to cave", "Fight dragon"],
  //array of function vars assigned to goTown onlick properties
  "button functions": [goStore, goCave, fightDragon],
  //object property named text with same string as text.innerText. Use \" \" escape quotes to properly quote 'Store' inside quotes. 
  text: "You are in the town square. You see a sign that says \"Store\"."},
  //second object that mimics 1st object but is tied to goStore function
  {
    //name propert's value is store instead of town square
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    //object for goCave function
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    //object for goFight
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    //location after killing monster
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    //location after dying - restart option
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You died. &#x2620;"
  },
   {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeated the dragon! YOU WON THE GAME! &#x1F389;"
  },
  //easter egg location
  { 
    name: "easter egg", 
    "button text": ["2", "8", "Go to town square?"], 
    "button functions": [pickTwo, pickEight, goTown], 
    text: "You found a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!" 
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

//update funct w/ location param to handle repetition between goTown and goStore functions
function update(location) {
  //make monster stats disappear following fight
  monsterStats.style.display = "none";
  //use bracket notation on value to get property of location object passed into function w/ "button text" array index
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  //itialize button elements with onclick special property.element.onlick = function
  //assign values to "button functions" array
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  //Use dot notation for text instead of bracket notation
  text.innerHTML = location.text;
}

/* empty functions - no param */
function goTown() {
  //pass locations array into update function call w/ 0 index
  update(locations[0]);
}

function goStore() {
//pass locations array into update function call w/ 1 index
update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  //player must have at least 10 gold
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    //update text w/ innerText
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  //only allow buyWeapon function if there are weapon indices left to add to inventory. Since index starts at 0, -1 from length since last element is 1 less than length
  if (currentWeaponIndex < weapons.length - 1){
    //weapon costs at least 30 gold. nest if statement if there are still weapons available
    if (gold >= 30) {
      //subtract gold amount with purchase and update weapon index count
      gold -= 30;
      currentWeaponIndex++;
      //display new gold value and obtained weapon message
      goldText.innerText = gold;
      //initialize new weapon from weapons array and use .name to find weapon name property
      let newWeapon = weapons[currentWeaponIndex].name;
      text.innerText = "You now have a " + newWeapon + ".";
      //add weapon to inventory by pushing new weapon into inventory array
      inventory.push(newWeapon);
      //display inventory text following push
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    //if player has most powerful weapon, add ability to sell other weapons
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
//player should not be allowed to sell only weapon in inventory
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    //.shift() method to delete 1st weapon in invetory
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    //+= compound sold weapon message with current invetory status
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

//monsters to fight referenced in monsters array. fighting = index
function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

//call update function w/ locations array object 4 (fight) as arg
function goFight() {
  update(locations[3]);
  //track monster health during fight
  monsterHealth = monsters[fighting].health;
  //change monsterStats from none to block to display stats during fight
  monsterStats.style.display = "block";
  //update unique monster name and health
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  //update text w/ current monster name and current weapon being used
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  //weaponsArray[weaponIndexVariable].nameObjectProperty
  text.innerText += " You attack it with your " + weapons[currentWeaponIndex].name + ".";
  //player health = health - monster level | added getMonsterAttackValue function for dynamic attack value. Monster level passed as an argument of the function
  health -= getMonsterAttackValue(monsters[fighting].level);
  //if monster is hit (call function), do same for monster health = monster health - player weapon power + random factor by character xp. More xp = greater character damage potential. If miss, else
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " You missed.";
  }
  //postmortem attack health and monster health message
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  //if health hits 0 = lose game | else if monster hits 0 = defeat monster
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    //beat dragon = win. Dragon = 2 in array. Else = continue game
    if (fighting === 2) {
      winGame();
    } else {
    defeatMonster();
    }
  }
  //add chance weapon could break, but must have at least 1 weapon
  if (Math.random() <= .1 && inventory.length !== 1) {
    //.pop() to - last in inventory and return it in text. also, -- weapon index
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeaponIndex--;
  }
}

//dynamic monster attack value function sets monster's attack to five times their level minus a random number between 0 and player's xp
function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  //ternary - if hit is > 0 returns hit. If false, returns 0
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  //set gold reward for defeating monster (higher lvl = more gold) and round amount via math floor
  gold += Math.floor(monsters[fighting].level * 6.7);
  //gain xp based on monster lvl as well
  xp += monsters[fighting].level;
  //display new values
  goldText.innerText = gold;
  xpText.innerText = xp;
  //update 5th location in array
  update(locations[4]);
}

function lose() {
  //6th location = lose game
  update(locations[5]);
}

function winGame() {
  //location 7 = win game
  update(locations[6]);
}

//make restarting game/values an option and display this reset info
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

//easter egg location for additional fun
function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  //"\n" added to make random #s appeat on next line
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    //numbers[i] = random number from while loop to display
    text.innerText += numbers[i] + "\n";
  }
  //.includes method to check if user guess is in numbers array. win = + gold. lose = - health. 
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
