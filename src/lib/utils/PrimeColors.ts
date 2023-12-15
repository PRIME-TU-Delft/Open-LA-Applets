type ColorString = `#${string}`;

export enum BackgroundColors {
  dark = '#1A1A1A',
  medium = '#CFC7C0',
  light = '#E0E0E0'
}

// Official Colors from TU Delft
// https://www.tudelft.nl/huisstijl/bouwstenen/kleur
export enum PrimeColor {
  red = '#E03C31',
  yellow = '#FFB81C',
  dark_green = '#009B77',
  blue = '#0076C2',
  pink = '#EF60A3',
  purple = '#6F1D77',
  black = '#565656',
  orange = 'EC6842',
  cyan = '00A6D6',
  raspberry = 'A50034',
  turquoise = '00B8C8'

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
