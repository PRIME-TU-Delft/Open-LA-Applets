import { Vector3 } from 'three';
import { PrimeColor } from 'utils/PrimeColors';

type Color = PrimeColor | '#94a3b8' | 'white';
type Location = 'start' | 'end' | 'center';

export default class ThrottleLabel {
  position?: Vector3;
  size: number;
  color: Color;
  opacity: number;
  isVector: boolean;
  font: string;
  location: Location;

  private title: string;

  constructor(
    title: string,
    color: Color = '#94a3b8',
    size = 0.3,
    position: Vector3 | undefined = undefined
  ) {
    this.color = color;
    this.position = position;
    this.size = size;
    this.font = 'sans-serif';
    this.opacity = 1;
    this.isVector = false;
    this.title = title;
    this.location = 'center';
  }

  static default() {
    return new ThrottleLabel('');
  }

  get text() {
    if (this.isVector) {
      return this.title;
    }
    return this.title;
  }

  setVector(to = true) {
    this.isVector = to;

    this.font = to ? 'serif' : 'sans-serif';

    return this;
  }

  to(location: Location) {
    this.location = location;
    return this;
  }
}
