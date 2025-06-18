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
  id = crypto.randomUUID();

  defaultValue = new Vector2(0, 0);
  value = $state(new Vector2(0, 0));
  color: string = PrimeColor.blue;
  width = 0;
  type = 'draggable';
  label = '';
  snapFn: (value: Vector2) => Vector2;
  releaseFn: (value: Vector2) => Vector2;

  constructor(
    defaultValue: Vector2,
    color: string = PrimeColor.blue,
    label: string = '',
    snapFn: (value: Vector2) => Vector2 = (v) => v,
    releaseFn: ((value: Vector2) => Vector2) | undefined = undefined
  ) {
    this.defaultValue = defaultValue.clone();
    this.value = defaultValue;
    this.color = color;
    this.label = label;
    this.snapFn = snapFn;
    this.releaseFn = releaseFn ?? snapFn;
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

  get position() {
    return this.value;
  }

  set position(v: Vector2) {
    this.value = this.snapFn(v);
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
      this.releaseFn
    );
  }
}
