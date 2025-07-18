/**
 * Format string to be more human readable
 * @param string String to format
 */
export function formatString(string: string) {
  const spaces = string.replaceAll('_', ' ');
  return spaces.charAt(0).toUpperCase() + spaces.slice(1);
}

/**
 * Format number to always have + or - before it
 * @param number Number to format
 */
export function withSign(number: number) {
  const abs = Math.abs(number);

  if (number < 0) {
    return "- " + abs;
  } else {
    return "+ " + abs;
  }
}
