export type ColorString = string;

// Official Colors from the TU Delft
// https://www.tudelft.nl/huisstijl/bouwstenen/kleur
// The ordering of the colors in this enum matters, applets in chapter 'lines and planes' are colored by order.
export class PrimeColor {
  static raspberry: ColorString = '#A50034';
  static yellow: ColorString = '#FFB81C';
  static darkGreen: ColorString = '#009B77';
  static blue: ColorString = '#0076C2';
  static black: ColorString = '#565656';
  static orange: ColorString = '#EC6842';
  static cyan: ColorString = '#00A6D6';

  // Opacity is a value between 0 and 1
  static opacity(opacity: number): string {
    return Math.round(opacity * 255).toString(16);
  }

  static asArray(): ColorString[] {
    return Object.values(PrimeColor);
  }

  static getRandomColor(): ColorString {
    const colors = Object.values(PrimeColor);
    const randomIndex = Math.round(Math.random() * colors.length);
    return colors[randomIndex];
  }

  static getColor(index: number): ColorString {
    const colors = Object.values(PrimeColor);
    return colors[index % colors.length];
  }
}
