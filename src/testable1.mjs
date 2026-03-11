export function daysUntilChristmas(now) {
  const millisPerDay = 24 * 60 * 60 * 1000;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const christmasDay = new Date(now.getFullYear(), 12 - 1, 25);
  if (today.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(now.getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - today.getTime();
  return Math.floor(diffMillis / millisPerDay);
}

/**
 * The above code is difficult to test, because the result varies based on the day that the function is run.
 * Fix: give the Date as a parameter to the function, so that tests can be run predictably
 */
