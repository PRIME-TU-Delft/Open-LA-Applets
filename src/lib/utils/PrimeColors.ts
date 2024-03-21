type ColorString = `#${string}`;

export enum BackgroundColors {
  dark = '#1A1A1A',
  medium = '#CFC7C0',
  light = '#E0E0E0'
}

// Official Colors from the TU Delft
// https://www.tudelft.nl/huisstijl/bouwstenen/kleur
// The ordering of the colors in this enum matters, applets in chapter 'lines and planes' are colored by order.
export enum PrimeColor {
  raspberry = '#A50034',
  yellow = '#FFB81C',
  darkGreen = '#009B77',
  blue = '#0076C2',
  black = '#565656',
  orange = '#EC6842',
  cyan = '#00A6D6'
}

export const primeColorArray = Object.values(PrimeColor);

export default function getRandomColor(): ColorString {
  const colors = Object.values(PrimeColor);

  const randomIndex = Math.round(Math.random() * colors.length);

  return colors[randomIndex];
}

export function getColor(index: number): ColorString {
  const colors = Object.values(PrimeColor);

  return colors[index % colors.length];
}
