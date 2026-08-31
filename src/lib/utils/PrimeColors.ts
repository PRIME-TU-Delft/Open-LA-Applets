export type ColorString = string;

// Official Colors from the TU Delft
// https://www.tudelft.nl/huisstijl/bouwstenen/kleur
// The ordering of the colors in this enum matters, applets in chapter 'lines and planes' are colored by order.
export class PrimeColor {
  static raspberry: ColorString = '#A50034';
  static yellow: ColorString = '#FFB81C';
  static darkGreen: ColorString = '#009B77';
  static blue: ColorString = '#0076C2';
  static grey: ColorString = '#565656';
  static orange: ColorString = '#EC6842';
  static cyan: ColorString = '#00A6D6';
  static purple: ColorString = '#6F1D77';
  static pink: ColorString = '#EF60A3';
  static red: ColorString = '#E03C31';
  static green: ColorString = '#6CC24A';
  static darkBlue: ColorString = '#0C2340';
  static transparent: ColorString = '#00000000'; // Transparent color
  static white: ColorString = '#FFFFFF';
  static black: ColorString = '#222832'; // black color

  // Opacity is a value between 0 and 1
  static opacity(opacity: number): string {
    return Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
  }

  // Scales a color's RGB channels by amount, like CSS's filter: brightness(amount)
  static brightness(color: ColorString, amount: number): ColorString {
    const hex = color.replace('#', '');
    const channel = (offset: number) =>
      Math.min(255, Math.max(0, Math.round(parseInt(hex.slice(offset, offset + 2), 16) * amount)))
        .toString(16)
        .padStart(2, '0');
    const alpha = hex.length >= 8 ? hex.slice(6, 8) : '';

    return `#${channel(0)}${channel(2)}${channel(4)}${alpha}`;
  }

  static asArray(): ColorString[] {
    return Object.values(PrimeColor);
  }

  static getRandomColor(): ColorString {
    const colors = Object.values(PrimeColor);
    const randomIndex = Math.floor(Math.random() * (colors.length - 3)); // Exclude transparent, white, and black
    return colors[randomIndex];
  }

  static getColor(index: number): ColorString {
    const colors = Object.values(PrimeColor);
    return colors[index % colors.length];
  }
}
