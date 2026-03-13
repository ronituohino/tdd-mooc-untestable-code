function diceRoll() {
  const min = 1;
  const max = 6;
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function diceHandValue() {
  const die1 = diceRoll();
  const die2 = diceRoll();
  if (die1 === die2) {
    // one pair
    return 100 + die1;
  } else {
    // high die
    return Math.max(die1, die2);
  }
}

/**
 * The above code is difficult to test, because of randomness.
 * Fix: add the possibility to provide a seed for the random generation to get predictable results.
 * Note that the random properties of the code should also be tested using invariants.
 */
