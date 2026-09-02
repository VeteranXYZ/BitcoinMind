const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/**
 * Spells 0–999 in words. The site writes small counts as words in prose
 * (page ages, elapsed years) so the copy never has to be edited by hand
 * when the underlying date moves.
 */
export function spellNumber(n: number): string {
  if (n === 0) return 'zero';
  if (n < 20) return ONES[n]!;
  if (n < 100) {
    const tens = TENS[Math.floor(n / 10)]!;
    const ones = n % 10;
    return ones ? `${tens}-${ONES[ones]}` : tens;
  }
  const hundreds = ONES[Math.floor(n / 100)]!;
  const remainder = n % 100;
  return `${hundreds} hundred${remainder ? ` ${spellNumber(remainder)}` : ''}`;
}

/** Same as `spellNumber`, capitalised for the start of a sentence. */
export function spellNumberSentence(n: number): string {
  const word = spellNumber(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}
