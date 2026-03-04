import { ComputeEngine } from '@cortex-js/compute-engine';
import type { PrimeColor } from '../utils/PrimeColors';
import type { Vector2 } from 'three';
import type { FillType } from '$lib/utils/Legend';

type Domain = {
  xMin?: number;
  xMax?: number;
};

type Integral = {
  xLeft: number;
  xRight: number;
  fillStyle: 'full' | 'dashed';
};

type Shape = 'circle' | 'square' | 'triangle';

export class AppletObject {}

export class FunctionFragment extends AppletObject {
  func: (x: number) => number;
  color: PrimeColor;
  domain: Domain | undefined;
  gaps: Vector2[] = [];
  includedPoints: Vector2[] = [];
  integral: Integral | undefined;
  legendText: string | undefined;
  legendFill: FillType | undefined;
  isDashed: boolean = false;
  shape: Shape = 'circle';

  /**
   * Function fragment template object
   * @param func A javascript function or a latex string describing the function
   * @param color Color of the function graph
   * @param domain Domain on which the function should be drawn
   * @param isDashed Whether the function line should be dashed
   * @param shape Shape to use for legend and points
   */
  constructor(
    func: ((x: number) => number) | string,
    color: PrimeColor,
    domain?: Domain,
    isDashed?: boolean,
    shape?: Shape
  ) {
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
    if (isDashed) this.isDashed = isDashed;
    if (shape) this.shape = shape;
  }

  /**
   * Add gaps to the function fragment
   * @param positions List of Vector2 coordinates of the gaps
   * @returns this
   */
  addGaps(...positions: Vector2[]) {
    this.gaps = this.gaps.concat(positions);
    return this;
  }

  /**
   * Add included points to the function fragment
   * @param positions List of Vector2 coordinates of the included points
   * @returns this
   */
  addIncludedPoints(...positions: Vector2[]) {
    this.includedPoints = this.includedPoints.concat(positions);
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

  /**
   * Adds a legend item for this function
   * @param text Text to be shown in the legend item
   * @param fill Type of fill to be used in the legend item
   * @returns this
   */
  withLegend(text: string, fill?: FillType) {
    this.legendText = text;
    this.legendFill = fill;
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

export class ObliqueAsymptoteFragment extends FunctionFragment {
  /**
   * Oblique asymptote fragment template object
   * @param func A javascript function or a latex string describing the asymptote
   * @param color Color of the asymptote
   */
  constructor(func: ((x: number) => number) | string, color: PrimeColor) {
    super(func, color, undefined, true);
  }
}
