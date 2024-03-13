type ColorString = `#${string}`;

export enum BackgroundColors {
  dark = '#1A1A1A',
  medium = '#CFC7C0',
  light = '#E0E0E0'
}

// Official Colors from TU Delft
// https://www.tudelft.nl/huisstijl/bouwstenen/kleur
export enum PrimeColor {
  yellow = '#FFB81C',
  darkGreen = '#009B77',
  blue = '#0076C2',
  black = '#565656',
  orange = '#EC6842',
  cyan = '#00A6D6',
  raspberry = '#A50034'
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
