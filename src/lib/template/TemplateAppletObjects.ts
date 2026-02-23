import { ComputeEngine } from '@cortex-js/compute-engine';
import type { PrimeColor } from '../utils/PrimeColors';
import type { Vector2 } from 'three';

type Domain = {
  xMin?: number;
  xMax?: number;
};

type Integral = {
  xLeft: number;
  xRight: number;
  fillStyle: 'full' | 'dashed';
};

export class AppletObject {}

export class FunctionFragment extends AppletObject {
  func: (x: number) => number;
  color: PrimeColor;
  domain: Domain | undefined = undefined;
  gaps: Vector2[] = [];
  integral: Integral | undefined = undefined;

  /**
   * Function fragment template object
   * @param func A javascript function or a latex string describing the function
   * @param color Color of the function graph
   * @param domain Domain on which the function should be drawn
   */
  constructor(func: ((x: number) => number) | string, color: PrimeColor, domain?: Domain) {
    super();

    if (typeof func == 'string') {
      const ce = new ComputeEngine();
      const parsed = ce.parse(func);
      const compiled = parsed.compile();

      this.func = (x: number) => compiled({ x });
    } else {
      this.func = func;
    }
    this.color = color;
    this.domain = domain;
  }

  /**
   * Add gaps to the function fragment
   * @param positions List of Vector2 coordinates of the gaps
   * @returns this
   */
  addGaps(...xCoordinates: Vector2[]) {
    this.gaps = this.gaps.concat(xCoordinates);
    return this;
  }

  /**
   * Sets integral shading of the function
   * @param integral Properties of the integral
   * @returns this
   */
  withIntegral(integral: Integral) {
    this.integral = integral;
    return this;
  }
}

export class AsymptoteFragment extends AppletObject {
  color: PrimeColor;
  position: number;
  type: 'vertical' | 'horizontal';

  /**
   * Asymptote fragment template object
   * @param position x or y position of the asymptote (depending on type)
   * @param type whether the asymptote is horizontal or vertical
   * @param color color of the asymptote
   */
  constructor(position: number, type: 'vertical' | 'horizontal', color: PrimeColor) {
    super();

    this.type = type;
    this.color = color;
    this.position = position;
  }
}
