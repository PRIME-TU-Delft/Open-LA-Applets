import type { PrimeColor } from '../utils/PrimeColors';
import { parse, compile } from '@cortex-js/compute-engine';
import { Vector3 } from 'three';

type Domain = {
  xRange?: [number, number];
  yRange?: [number, number];
};

type Shape = 'circle' | 'square' | 'triangle' | 'diamond';

export abstract class AppletObject3D {
  color: PrimeColor;

  constructor(color: PrimeColor) {
    this.color = color;
  }
}

export abstract class AbstractFunctionFragment3D extends AppletObject3D {
  domain: Domain | undefined;
  width?: number;
  legendText: string | undefined;
  wireframe: boolean = false;
  shape: Shape = 'circle';
  pointsLegendText: { included: string | undefined; gaps: string | undefined } = {
    included: undefined,
    gaps: undefined
  };

  /**
   * Function fragment template object
   * @param color Color of the function graph
   * @param options.domain Domain on which the function should be drawn
   * @param options.width Width of the function line
   * @param options.wireframe Whether the function should be a wireframe
   * @param options.shape Shape to use for legend and points
   * @param options.legendText Text to be shown in the legend item
   */
  constructor(
    color: PrimeColor,
    options?: {
      domain?: Domain;
      width?: number;
      wireframe?: boolean;
      shape?: Shape;
      legendText?: string;
    }
  ) {
    super(color);

    this.domain = options?.domain;
    this.width = options?.width;
    this.legendText = options?.legendText;
    if (options?.wireframe) this.wireframe = options.wireframe;
    if (options?.shape) this.shape = options.shape;
  }
}

export class SurfaceFunction3D extends AbstractFunctionFragment3D {
  func: (x: number, y: number) => number;

  /**
   * Function fragment template object
   * @param func A javascript function or a latex string describing the function
   * @param color Color of the function graph
   * @param options.domain Domain on which the function should be drawn
   * @param options.width Width of the function line
   * @param options.isDashed Whether the function line should be dashed
   * @param options.shape Shape to use for legend and points
   * @param options.legendText Text to be shown in the legend item
   * @param options.wireframe Whether the function should be a wireframe
   */
  constructor(
    func: ((x: number, y: number) => number) | string,
    color: PrimeColor,
    options?: {
      domain?: Domain;
      width?: number;
      isDashed?: boolean;
      shape?: Shape;
      legendText?: string;
      wireframe: boolean;
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

export class TextObject3D extends AppletObject3D {
  latex: string;
  position: Vector3;
  size?: number;

  /**
   * Text template object
   * @param latex Latex string to display
   * @param position Position of the text in the scene
   * @param color Color of the text
   */
  constructor(latex: string, position: Vector3, color: PrimeColor, size?: number) {
    super(color);

    this.latex = latex;
    this.position = position;
    this.size = size;
  }
}

export class AngleObject3D extends AppletObject3D {
  position: Vector3;
  startVector: Vector3;
  endVector: Vector3;
  latex?: string;
  size?: number;

  /**
   * Angle template object
   * @param position Origin position of the angle
   * @param startVector Start vector of the angle
   * @param endVector End vector of the angle
   * @param color Color of the angle
   * @param options.latex Latex shown next to the angle
   */
  constructor(
    position: Vector3,
    startVector: Vector3,
    endVector: Vector3,
    color: PrimeColor,
    options?: {
      latex?: string;
      size?: number;
    }
  ) {
    super(color);

    this.position = position;
    this.startVector = startVector;
    this.endVector = endVector;
    this.latex = options?.latex;
    this.size = options?.size;
  }

  public isRight(): boolean {
    return (
      Math.abs(
        this.endVector.x * this.startVector.x +
          this.endVector.y * this.startVector.y +
          this.endVector.z * this.startVector.z
      ) < 0.0001
    );
  }

  public getVectors(): [Vector3, Vector3] {
    return [this.startVector, this.endVector];
  }
}

export class PointObject3D extends AppletObject3D {
  position: Vector3;
  shape?: Shape;
  latex?: string;
  legendText?: string;
  size?: number;

  /**
   * Point template object
   * @param position Position of the points
   * @param color Color of the points
   * @param options.shape Shape of the point
   * @param options.latex Latex shown next to the point
   * @param options.legendText Legend text of the point
   * @param options.size Radius of the point
   */
  constructor(
    position: Vector3,
    color: PrimeColor,
    options?: {
      shape?: Shape;
      latex?: string;
      legendText?: string;
      size?: number;
    }
  ) {
    super(color);

    this.position = position;
    this.shape = options?.shape;
    this.latex = options?.latex;
    this.legendText = options?.legendText;
    this.size = options?.size;
  }
}

export class VectorFieldObject3D extends AppletObject3D {
  func: (x: number, y: number, z: number) => Vector3;
  xRange?: [number, number];
  yRange?: [number, number];
  zRange?: [number, number];
  step?: number;
  normalize?: boolean;
  normalizedLength?: number;
  hideHead?: boolean;
  anchor?: 'middle' | 'start' | 'end';
  colorFn?: (x: number, y: number) => PrimeColor | string;

  constructor(
    func: (x: number, y: number, z: number) => Vector3,
    color: PrimeColor,
    options: {
      xRange?: [number, number];
      yRange?: [number, number];
      zRange?: [number, number];
      step?: number;
      normalize?: boolean;
      normalizedLength?: number;
      hideHead?: boolean;
      anchor?: 'middle' | 'start' | 'end';
      colorFn?: (x: number, y: number) => PrimeColor | string;
    }
  ) {
    super(color);
    this.func = func;
    this.xRange = options?.xRange;
    this.yRange = options?.yRange;
    this.zRange = options?.zRange;
    this.step = options?.step;
    this.normalize = options?.normalize;
    this.normalizedLength = options?.normalizedLength;
    this.hideHead = options?.hideHead;
    this.anchor = options?.anchor;
  }
}

export class LineSegmentObject3D extends AppletObject3D {
  startPoint: Vector3;
  endPoint: Vector3;
  radius?: number;
  latex?: string;
  isDashed?: boolean;
  shape?: Shape;
  legendText?: string;

  /**
   * Line fragment template object
   * @param startPoint Start point of the line
   * @param endPoint End point of the line
   * @param color Color of the line
   * @param options.radius Width of the line
   * @param options.latex Text shown next to the line
   * @param options.latexAlign How the text next to the line shuold be aligned, can overwrite auto-alignment
   * @param options.isDashed Whether the line should be dashed
   */
  constructor(
    startPoint: Vector3,
    endPoint: Vector3,
    color: PrimeColor,
    options?: {
      radius?: number;
      latex?: string;
      isDashed?: boolean;
      latexAlign?: {
        alignX?: 'left' | 'right' | 'center' | null;
        alignY?: 'top' | 'bottom' | 'center' | null;
      };
      shape?: Shape;
      legendText?: string;
    }
  ) {
    super(color);

    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.radius = options?.radius;
    this.latex = options?.latex;
    this.isDashed = options?.isDashed;
    this.shape = options?.shape;
    this.legendText = options?.legendText;
  }

  // public midpoint() {
  //   const midX = (this.startPoint.x + this.endPoint.x) / 2;
  //   const midY = (this.startPoint.y + this.endPoint.y) / 2;

  //   return new Vector2(midX, midY);
  // }
}

export class InfiniteLineObject3D extends LineSegmentObject3D {
  /**
   * Line fragment template object
   * @param start Start point of the line
   * @param end End point of the line
   * @param color Color of the line
   * @param options.radius Width of the line
   * @param options.latex Text shown next to the line
   * @param options.latexAlign How the text next to the line shuold be aligned, can overwrite auto-alignment
   * @param options.isDashed Whether the line should be dashed
   */
  constructor(
    start: Vector3,
    end: Vector3,
    color: PrimeColor,
    options?: {
      radius?: number;
      latex?: string;
      isDashed?: boolean;
      latexAlign?: {
        alignX?: 'left' | 'right' | 'center' | null;
        alignY?: 'top' | 'bottom' | 'center' | null;
      };
    }
  ) {
    super(start, end, color, options);
  }
}

export class PolygonObject3D extends AppletObject3D {
  points: Vector3[];
  offset?: Vector3;
  shape?: Shape;
  legendText?: string;

  constructor(
    points: Vector3[],
    color: PrimeColor,
    options?: { offset?: Vector3; shape?: Shape; legendText?: string }
  ) {
    super(color);
    this.points = points;
    this.offset = options?.offset;
    this.shape = options?.shape;
    this.legendText = options?.legendText;
  }
}

export class CuboidObject3D extends AppletObject3D {
  corners: [Vector3, Vector3];
  toggleEdges?: boolean;

  constructor(color: PrimeColor, corners: [Vector3, Vector3], toggleEdges?: boolean) {
    super(color);
    this.corners = corners;
    this.toggleEdges = toggleEdges;
  }
}
