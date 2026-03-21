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
  isDashed?: boolean;
  legendText?: string;
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
  isDashed: boolean = false;
  shape: Shape = 'circle';
  pointsLegendText: { included: string | undefined; gaps: string | undefined } = {
    included: undefined,
    gaps: undefined
  };

  /**
   * Function fragment template object
   * @param func A javascript function or a latex string describing the function
   * @param color Color of the function graph
   * @param options.domain Domain on which the function should be drawn
   * @param options.isDashed Whether the function line should be dashed
   * @param options.shape Shape to use for legend and points
   * @param options.integral Properties of the integral
   * @param options.legendText Text to be shown in the legend item
   */
  constructor(
    func: ((x: number) => number) | string,
    color: PrimeColor,
    options: {
      domain?: Domain;
      isDashed?: boolean;
      shape?: Shape;
      integral?: Integral;
      legendText?: string;
    }
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
    this.domain = options.domain;
    this.legendText = options.legendText;
    if (options.isDashed) this.isDashed = options.isDashed;
    if (options.shape) this.shape = options.shape;
    if (options.integral) this.integral = options.integral;
  }

  /**
   * Add gaps to the function fragment
   * @param positions List of Vector2 coordinates of the gaps
   * @param legendText (optional) Text shown in the legend for all the gap points
   * @returns this
   */
  addGaps(positions: Vector2 | Vector2[], legendText?: string) {
    this.gaps = this.gaps.concat(positions);
    this.pointsLegendText.gaps = legendText;
    return this;
  }

  /**
   * Add included points to the function fragment
   * @param positions List of Vector2 coordinates of the included points
   * @param legendText (optional) Text shown in the legend for all the included points
   * @returns this
   */
  addIncludedPoints(positions: Vector2 | Vector2[], legendText?: string) {
    this.includedPoints = this.includedPoints.concat(positions);
    this.pointsLegendText.included = legendText;
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
   * @param legendText Text to be shown in the legend item
   */
  constructor(func: ((x: number) => number) | string, color: PrimeColor, legendText?: string) {
    super(func, color, { isDashed: true, legendText: legendText });
  }
}
