import { Object3D } from 'three';
import type { Controller } from './Controls';

export type SlideShowSteps<State> = ((
  t: number,
  state: State
) => { state: State; labelNext: string; labelPrev: string })[];

export class SlideShow<State> implements Controller<State> {
  defaultValue: State;
  defaultLabel = '';

  value = $state() as State;
  index = $state(0);

  // The state of the animation that are automatically generated in the next() method
  states = $state([]) as State[];

  // The steps of the animation
  steps: SlideShowSteps<State>;

  // Do not play the animation if animation is already in progress, otherwise state will be overwritten
  inTransition = $state(false);

  type = 'animation';
  label = $state('');
  width = 100;

  constructor(defaultValue: State, steps: SlideShowSteps<State>, label: string = 'original state') {
    this.defaultValue = defaultValue;
    this.value = defaultValue;

    this.defaultLabel = label;
    this.label = label;

    this.steps = steps;
  }

  hasNext() {
    return this.index < this.steps.length;
  }

  hasPrev() {
    return this.index > 0;
  }

  /**
   * Deeply clones a state object
   * @param s - The state object to clone
   * @returns A deep clone of the state object
   */
  clone(s: unknown): State {
    // Three.js Object3D (e.g. Vector3, Vector2, etc.) are not cloned by the above method
    if (s instanceof Object3D) return s.clone() as State;

    if (s instanceof Array) return s.map((x) => this.clone(x as unknown)) as State;

    if (s instanceof Object) {
      if ('clone' in s && s.clone instanceof Function) return s.clone() as State;

      const newS: { [key: string]: unknown } = {};
      const keys = Object.keys(s) as (keyof typeof s)[];
      for (const key of keys) {
        newS[key] = this.clone(s[key] as unknown);
      }

      return newS as State;
    }

    return s as State;
  }

  /**
   * Advances the animation by one step and animates the transition
   * @param ms - The duration of the transition in milliseconds
   * @param timeSteps - The number of steps in the transition
   * @returns A promise that resolves when the transition is complete
   */
  next(ms: number = 750, timeSteps: number = 20) {
    if (!this.hasNext() || this.inTransition) return Promise.resolve(this);

    this.inTransition = true;
    const current_value = this.clone(this.value);
    this.states[this.index] = current_value;

    let i = 0;
    const interval = setInterval(() => {
      const result = this.steps[this.index](i / timeSteps, this.clone(current_value));
      this.value = result.state;
      this.label = result.labelNext;

      if (i++ >= timeSteps - 1) {
        clearInterval(interval);
        const result = this.steps[this.index](1, this.clone(current_value));
        this.value = result.state;
        this.label = result.labelNext;
        this.index++;
        this.inTransition = false;

        return Promise.resolve(this);
      }
    }, ms / timeSteps);
  }

  /**
   * Reverses the animation by one step and animates the transition
   * @param ms - The duration of the transition in milliseconds
   * @param timeSteps - The number of steps in the transition
   * @returns A promise that resolves when the transition is complete
   */
  prev(ms: number = 750, timeSteps: number = 20) {
    if (!this.hasPrev() || this.inTransition) return Promise.resolve(this);

    this.inTransition = true;
    const current_value = this.states[this.index - 1];

    let i = 0;
    const interval = setInterval(() => {
      const result = this.steps[this.index - 1](1 - i / timeSteps, this.clone(current_value));
      this.value = result.state;
      this.label = result.labelPrev;

      if (i++ >= timeSteps - 1) {
        clearInterval(interval);
        this.value = this.states[this.index - 1];
        this.index--;
        this.inTransition = false;

        return Promise.resolve(this);
      }
    }, ms / timeSteps);
  }

  setToDefault() {
    this.value = this.defaultValue;
    this.label = this.defaultLabel;
    this.index = 0;
  }

  reset(ms: number = 1000, timeSteps: number = 20) {
    if (this.index == 0) return this;

    const interval = setInterval(
      () => {
        if (this.index == 0) {
          clearInterval(interval);
          this.setToDefault();
          return this;
        }
        this.prev(ms / this.index, timeSteps);
      },
      ms / this.index + 1
    );

    return this;
  }
}
