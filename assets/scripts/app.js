const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

let chosenMaxLife = 100;
let currMonsterHealth = chosenMaxLife;
let currPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function reset() {
    currMonsterHealth = chosenMaxLife;
    currPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currPlayerHealth -= playerDamage;

    if (currPlayerHealth <= 0 && hasBonusLife ) {
        hasBonusLife = false;
        removeBonusLife;
        currPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You had to die! But bonus life saved you!")
    }

    if (currMonsterHealth <= 0 && currPlayerHealth > 0) {
        alert("You won!");
    } else if (currPlayerHealth <= 0 && currMonsterHealth > 0) {
        alert("You lost!");
    } else if (currPlayerHealth <= 0 && currMonsterHealth <= 0) {
        alert("You have a draw!");
    }

    if (currMonsterHealth <= 0 || currPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    let maxDamage;
    if (mode === "ATTACK") {
        maxDamage = ATTACK_VALUE;
    } else if (mode === "STRONG_ATTACK") {
        maxDamage = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamage);
    currMonsterHealth -= damage;
    endRound();
}

function attackHandler() {
    attackMonster("ATTACK");
}

function strongAttackHandler() {
    attackMonster("STRONG_ATTACK");
}

function healPlayerHandler() {
    let healValue;
    if (currPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal more than your max health.");
        healValue = chosenMaxLife - currPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currPlayerHealth += HEAL_VALUE;
    endRound();
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
