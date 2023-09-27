const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK"; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; // MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLogEntry;

function getMaxLifeValues() {
    const enteredValue = prompt("Maximum life for you and the monster.", "100");

    let parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw { message: "Invalid user input, not a number!" };
    }
    return parsedValue;
}

let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert('You entered something wrong, default value of 100 was used.');
  // throw error;
}

let currMonsterHealth = chosenMaxLife;
let currPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHeath: monsterHealth,
        finalPlayerHealth: playerHealth,
    };
    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = "MONSTER";
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = "PLAYER";
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = "PLAYER";
            break;
        default:
            logEntry = {};
    }
    battleLog.push(logEntry);
}

function reset() {
    currMonsterHealth = chosenMaxLife;
    currPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currMonsterHealth,
        currPlayerHealth
    );

    if (currPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife;
        currPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You died! But bonus life saved you!");
    }

    if (currMonsterHealth <= 0 && currPlayerHealth > 0) {
        alert("You won!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "PLAYER_WON",
            currMonsterHealth,
            currPlayerHealth
        );
    } else if (currPlayerHealth <= 0 && currMonsterHealth > 0) {
        alert("You lost!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "MONSTER_WON",
            currMonsterHealth,
            currPlayerHealth
        );
    } else if (currPlayerHealth <= 0 && currMonsterHealth <= 0) {
        alert("You have a draw!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "A DRAW",
            currMonsterHealth,
            currPlayerHealth
        );
    }

    if (currMonsterHealth <= 0 || currPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    let logEvent =
        mode === MODE_ATTACK
            ? LOG_EVENT_PLAYER_ATTACK
            : LOG_EVENT_PLAYER_STRONG_ATTACK;
    const damage = dealMonsterDamage(maxDamage);
    currMonsterHealth -= damage;
    writeToLog(logEvent, damage, currMonsterHealth, currPlayerHealth);
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHeath: monsterHealth,
        finalPlayerHealth: playerHealth,
    };
    if (currPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal more than your max health.");
        healValue = chosenMaxLife - currPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currPlayerHealth += HEAL_VALUE;
    writeToLog(logEvent, healValue, currMonsterHealth, currPlayerHealth);
    endRound();
}

function printLogHandler() {
    for (let i = 0; i < 3; i++) {
        console.log("----------");
    }
    let j = 0;
    outerWhile: do {
        console.log("Outer", j);
        innerFor: for (let k = 0; k < 5; k++);
        {
            if (k === 3) {
                // break outerWhile;
                continue outerWhile; // dangerous, infinite loop here!
            }
            console.log("Inner", k);
        }
        j++;
    } while (j < 3);

    // for (let i = 0; i < battleLog.length; i++) {
    //     console.log(battleLog[i]);
    // }
    let i = 0;
    for (const logEntry of battleLog) {
        if ((!lastLogEntry && lastLogEntry !== 0) || lastLogEntry < i) {
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`${key} => ${logEntry[key]}`);
            }
            lastLogEntry = i;
            break;
        }
        i++;
    }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
