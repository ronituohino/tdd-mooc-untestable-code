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
 *
 * Ok, apparently JS does not support seeding randomness (of course not -.-)
 * So, we are going to have to use invariants for this one.
 *
 * Moving die1 and die2 into parameters of the functions gives better testability though, because then
 * The logic of the 2 functions is separated.
 */
