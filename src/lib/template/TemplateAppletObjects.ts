import type { PrimeColor } from '../utils/PrimeColors';
import { Vector2 } from 'three';
import { parse, compile } from '@cortex-js/compute-engine';

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

export abstract class AppletObject {
  color: PrimeColor;

  constructor(color: PrimeColor) {
    this.color = color;
  }
}

export abstract class AbstractFunctionFragment extends AppletObject {
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
   * @param color Color of the function graph
   * @param options.domain Domain on which the function should be drawn
   * @param options.isDashed Whether the function line should be dashed
   * @param options.shape Shape to use for legend and points
   * @param options.integral Properties of the integral
   * @param options.legendText Text to be shown in the legend item
   */
  constructor(
    color: PrimeColor,
    options?: {
      domain?: Domain;
      isDashed?: boolean;
      shape?: Shape;
      integral?: Integral;
      legendText?: string;
    }
  ) {
    super(color);

    this.domain = options?.domain;
    this.legendText = options?.legendText;
    if (options?.isDashed) this.isDashed = options.isDashed;
    if (options?.shape) this.shape = options.shape;
    if (options?.integral) this.integral = options.integral;
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

export class FunctionFragment extends AbstractFunctionFragment {
  func: (x: number) => number;

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
    options?: {
      domain?: Domain;
      isDashed?: boolean;
      shape?: Shape;
      integral?: Integral;
      legendText?: string;
    }
  ) {
    super(color, options);

    if (typeof func == 'string') {
      const parsed = parse(func);
      const compiled = compile(parsed);

      this.func = (x: number) => {
        const result = compiled.run?.({ x });
        return typeof result === 'number' ? result : Number(result);
      };
    } else {
      this.func = func;
    }
  }
}

export class ImplicitFunctionFragment extends AbstractFunctionFragment {
  func: (x: number, y: number) => number;

  /**
   * Implicit function fragment template object
   * @param func A javascript function or a latex string describing the function. If in JS, it has to be a zero func (=0)
   * @param color Color of the function graph
   * @param options.domain Domain on which the function should be drawn
   * @param options.isDashed Whether the function line should be dashed
   * @param options.shape Shape to use for legend and points
   * @param options.legendText Text to be shown in the legend item
   */
  constructor(
    func: ((x: number, y: number) => number) | string,
    color: PrimeColor,
    options?: {
      domain?: Domain;
      isDashed?: boolean;
      shape?: Shape;
      legendText?: string;
    }
  ) {
    super(color, options);

    if (typeof func == 'string') {
      // For implicit equations like "x^2 + y^2 = 3", compile as f(x, y) = 0.
      const zeroForm = func.includes('=')
        ? (() => {
            const [left, ...rightParts] = func.split('=');
            const right = rightParts.join('=');
            return `(${left}) - (${right})`;
          })()
        : func;

      const parsed = parse(zeroForm);
      const compiled = compile(parsed);

      this.func = (x: number, y: number) => {
        const result = compiled.run?.({ x, y });
        return typeof result === 'number' ? result : Number(result);
      };
    } else {
      this.func = func;
    }
  }
}

export class ParameterizedFunctionFragment extends AbstractFunctionFragment {
  xFunc: (t: number) => number;
  yFunc: (t: number) => number;
  tDomain: {
    start?: number;
    end?: number;
  };

  /**
   * Parameterized function fragment template object
   * @param xFunc A javascript function or a latex string, with t being the parameter
   * @param yFunc A javascript function or a latex string, with t being the parameter
   * @param color Color of the function graph
   * @param options.isDashed Whether the function line should be dashed
   * @param options.shape Shape to use for legend and points
   * @param options.legendText Text to be shown in the legend item
   * @param options.tStart Start value for t
   * @param options.tEnd End value for t
   */
  constructor(
    xFunc: ((t: number) => number) | string,
    yFunc: ((t: number) => number) | string,
    color: PrimeColor,
    options?: {
      isDashed?: boolean;
      shape?: Shape;
      legendText?: string;
      tStart?: number;
      tEnd?: number;
    }
  ) {
    super(color, options);

    this.tDomain = {
      start: options?.tStart,
      end: options?.tEnd
    };

    if (typeof xFunc == 'string') {
      const parsed = parse(xFunc);
      const compiled = compile(parsed);

      this.xFunc = (t: number) => {
        const result = compiled.run?.({ t });
        return typeof result === 'number' ? result : Number(result);
      };
    } else {
      this.xFunc = xFunc;
    }

    if (typeof yFunc == 'string') {
      const parsed = parse(yFunc);
      const compiled = compile(parsed);

      this.yFunc = (t: number) => {
        const result = compiled.run?.({ t });
        return typeof result === 'number' ? result : Number(result);
      };
    } else {
      this.yFunc = yFunc;
    }
  }
}

export class AsymptoteFragment extends AppletObject {
  position: number;
  type: 'vertical' | 'horizontal';

  /**
   * Asymptote fragment template object
   * @param position x or y position of the asymptote (depending on type)
   * @param type whether the asymptote is horizontal or vertical
   * @param color color of the asymptote
   */
  constructor(position: number, type: 'vertical' | 'horizontal', color: PrimeColor) {
    super(color);

    this.type = type;
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

export class Text extends AppletObject {
  latex: string;
  position: Vector2;
  alignment?: {
    alignX?: 'left' | 'right' | 'center' | null;
    alignY?: 'top' | 'bottom' | 'center' | null;
  };

  /**
   * Text template object
   * @param latex Latex string to display
   * @param position Position of the text in the scene
   * @param color Color of the text
   */
  constructor(
    latex: string,
    position: Vector2,
    color: PrimeColor,
    alignment?: {
      alignX?: 'left' | 'right' | 'center' | null;
      alignY?: 'top' | 'bottom' | 'center' | null;
    }
  ) {
    super(color);

    this.latex = latex;
    this.position = position;
    this.alignment = alignment;
  }
}

export class Angle extends AppletObject {
  position: Vector2;
  startAngle: number;
  endAngle: number;
  hasHead?: boolean;
  distance?: number;

  /**
   * Angle template object
   * @param position Origin position of the angle
   * @param startAngle Start angle of the angle (radians)
   * @param endAngle End angle of the angle (radians)
   * @param color Color of the angle
   * @param options.hasHead Whether the angle shuold have an arrow head
   * @param options.distance Distance of the angle arch from the origin
   */
  constructor(
    position: Vector2,
    startAngle: number,
    endAngle: number,
    color: PrimeColor,
    options?: {
      hasHead?: boolean;
      distance?: number;
    }
  ) {
    super(color);

    this.position = position;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.hasHead = options?.hasHead;
    this.distance = options?.distance;
  }

  /**
   * Create an angle template object from 2 vectors
   * @param position Origin position of the angle
   * @param v1 First vector that describes the angle
   * @param v2 Second vector that describes the angle
   * @param color Color of the angle
   * @param options.hasHead Whether the angle shuold have an arrow head
   * @param options.distance Distance of the angle arch from the origin
   */
  static fromVectors(
    position: Vector2,
    v1: Vector2,
    v2: Vector2,
    color: PrimeColor,
    options?: {
      hasHead?: boolean;
      distance?: number;
    }
  ): Angle {
    const sAngle = v1.angle();
    const eAngle = v2.angle();

    return new Angle(position, sAngle, eAngle, color, options);
  }

  public isRight(): boolean {
    return Math.abs(Math.abs(this.endAngle - this.startAngle) - Math.PI / 2) < 0.0001;
  }

  public getVectors(): [Vector2, Vector2] {
    const v1 = new Vector2(Math.cos(this.startAngle), Math.sin(this.startAngle));
    const v2 = new Vector2(Math.cos(this.endAngle), Math.sin(this.endAngle));

    return [v1, v2];
  }
}

export class Point extends AppletObject {
  position: Vector2;
  shape?: Shape;
  latex?: string;
  legendText?: string;

  /**
   * Point template object
   * @param position Position of the points
   * @param color Color of the points
   * @param options.shape Shape of the point
   * @param options.latex Latex shown next to the point
   * @param options.legendText Legend text of the point
   */
  constructor(
    position: Vector2,
    color: PrimeColor,
    options?: {
      shape?: Shape;
      latex?: string;
      legendText?: string;
    }
  ) {
    super(color);

    this.position = position;
    this.shape = options?.shape;
    this.latex = options?.latex;
    this.legendText = options?.legendText;
  }
}

export class LineFragment extends AppletObject {
  startPoint: Vector2;
  endPoint: Vector2;
  latex?: string;
  latexAlign?: {
    alignX?: 'left' | 'right' | 'center' | null;
    alignY?: 'top' | 'bottom' | 'center' | null;
  };
  isDashed?: boolean;

  /**
   * Line fragment template object
   * @param start Start point of the line
   * @param end End point of the line
   * @param color Color of the line
   * @param options.latex Text shown next to the line
   * @param options.latexAlign How the text next to the line shuold be aligned, can overwrite auto-alignment
   * @param options.isDashed Whether the line should be dashed
   */
  constructor(
    start: Vector2,
    end: Vector2,
    color: PrimeColor,
    options?: {
      latex?: string;
      isDashed?: boolean;
      latexAlign?: {
        alignX?: 'left' | 'right' | 'center' | null;
        alignY?: 'top' | 'bottom' | 'center' | null;
      };
    }
  ) {
    super(color);

    this.startPoint = start;
    this.endPoint = end;
    this.latex = options?.latex;
    this.isDashed = options?.isDashed;
    this.latexAlign = options?.latexAlign;
  }

  public midpoint() {
    const midX = (this.startPoint.x + this.endPoint.x) / 2;
    const midY = (this.startPoint.y + this.endPoint.y) / 2;

    return new Vector2(midX, midY);
  }
}

export class Circle extends AppletObject {
  origin: Vector2;
  radius: number;
  isDashed?: boolean;

  /**
   * Circle template object
   * @param origin Origin point of the circle
   * @param radius Radius of the circle
   * @param color Color of the circle
   * @param isDashed Whether the circle should be dashed
   */
  constructor(origin: Vector2, radius: number, color: PrimeColor, isDashed?: boolean) {
    super(color);

    this.origin = origin;
    this.radius = radius;
    this.isDashed = isDashed;
  }
}

export class Polygon extends AppletObject {
  points: Vector2[];
  fillStyle: 'full' | 'dashed' | 'none' = 'none';
  sideLatex?: string[];

  /**
   * Polygon template object
   * @param points Points of the polygon (clockwise or anty-clockwise)
   * @param color Color of the polygon
   * @param options.fillStyle Style of the fill of the polygon
   * @param options.sideLatex List of strings to put on the polygon sides, they are auto-aligned
   */
  constructor(
    points: Vector2[],
    color: PrimeColor,
    options?: { fillStyle?: 'full' | 'dashed' | 'none'; sideLatex?: string[] }
  ) {
    super(color);

    this.points = points;
    if (options?.fillStyle) this.fillStyle = options?.fillStyle;
    this.sideLatex = options?.sideLatex;
  }
}
