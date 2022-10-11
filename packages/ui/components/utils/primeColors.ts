type ColorString = `#${string}`;

export enum BackgroundColors {
  dark = '#1A1A1A',
  medium = '#CFC7C0',
  light = '#E0E0E0'
}

export enum PrimeColor {
  grey = '#CFC7C0',
  yellow = '#FFCE2E',
  ultramarine = '#7AB1E8',
  pink = '#F87089',
  green = '#308167',
  red = '#E15F55'
}

export default function getRandomColor(): ColorString {
  const colors = Object.values(PrimeColor);

  const randomIndex = Math.round(Math.random() * colors.length);

  return colors[randomIndex];
}
