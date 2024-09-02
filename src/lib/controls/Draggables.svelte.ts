import type { Controller } from './Controls';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { Vector2 } from 'three';

/**
 * The Draggable class is used to create a draggable with a default value and a range of values.
 * The default values are set to new Vector2(0, 0)
 * The default color is ultramarine.
 *
 * @param defaultValue The default value for the draggable
 * @param color The color of the draggable default is blue
 * @param label The label of the draggable
 * @param snapFn The function to snap the draggable to the grid
 * @param valueFn The function to format the value
 */

export class Draggable implements Controller<Vector2> {
  defaultValue = new Vector2(0, 0);
  value = $state(new Vector2(0, 0));
  color: string = PrimeColor.blue;
  width = 0;
  type = 'draggable';
  label = '';
  snapFn: (value: Vector2) => Vector2;
  valueFn: (v: number) => string;

  constructor(
    defaultValue: Vector2,
    color: string = PrimeColor.blue,
    label: string = '',
    snapFn: (value: Vector2) => Vector2 = (v) => v,
    valueFn: (v: number) => string = (v) => v.toString()
  ) {
    this.defaultValue = defaultValue.clone();
    this.value = defaultValue;
    this.color = color;
    this.label = label;
    this.snapFn = snapFn;
    this.valueFn = valueFn;
  }

  static Default = new Draggable(new Vector2(0, 0));

  static set(dft = new Vector2(0, 0)) {
    return new Draggable(dft);
  }

  static get snapToGrid() {
    return (value: Vector2) => {
      return new Vector2(Math.round(value.x), Math.round(value.y));
    };
  }

  updateBy(step: Vector2) {
    this.value = this.value.clone().sub(step);
  }

  reset(ms: number, timeSteps: number = 20) {
    const delta = this.value.clone().sub(this.defaultValue).divideScalar(timeSteps);

    // Return early if the delta is near zero
    if (delta.length() < 0.0001) {
      this.value = this.defaultValue.clone();
      return this;
    }

    let i = 0;
    const interval = setInterval(() => {
      this.updateBy(delta);

      if (i++ === timeSteps - 1) {
        clearInterval(interval);
        this.value = this.defaultValue.clone();
      }
    }, ms / timeSteps);

    return this;
  }

  clone() {
    return new Draggable(
      this.defaultValue.clone(),
      this.color,
      this.label,
      this.snapFn,
      this.valueFn
    );
  }

  toURL() {
    return `${this.value}`;
  }

  fromURL(s: string) {
    const [x, y] = s.split(',').map(parseFloat);
    this.value = new Vector2(x, y);

    return this;
  }
}
