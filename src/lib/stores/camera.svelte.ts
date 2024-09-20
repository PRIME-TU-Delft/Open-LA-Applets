import { round } from '$lib/utils/MathLib';
import type { OrthographicCamera } from 'three';

export class Camera3D {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  zoom: number = 0;

  /**
   * Define what a camera should store of 3 Dimensions
   * @param x: number;
   * @param y: number;
   * @param z: number;
   * @param zoom: number;
   */
  constructor(cam: OrthographicCamera) {
    const pos = cam.position;
    this.x = pos.x;
    this.y = pos.y;
    this.z = pos.z;
    this.zoom = cam.zoom;
  }

  positionString(rounded: undefined | number) {
    if (rounded) {
      return [this.x, this.y, this.z].map((x) => round(x, rounded)).join(',');
    }

    return [this.x, this.y, this.z].join(',');
  }

  zoomString(rounded: undefined | number) {
    if (rounded) {
      return round(this.zoom, rounded).toString();
    }

    return this.zoom.toString();
  }
}

/**
 * Define what a camera transform in 2D
 * Is a D3 Transform (this type is not exposed to the end-user)
 * @see https://d3js.org/d3-zoom#zoom_transform
 * Thus is redefined here :(
 */
export interface Transform2D extends Array<number> {
  x: number;
  y: number;
  k: number;
}

export class Camera2D {
  // Define what a camera should store of 2 Dimensions
  constructor(
    public x: number,
    public y: number,
    public zoom: number
  ) {}

  static new(transform: Transform2D, enablePan = false) {
    if (enablePan) {
      return new Camera2D(transform.x, transform.y, transform.k);
    }
    return new Camera2D(0, 0, transform.k);
  }

  static toCoordinateSystem(num: number, width: number) {
    return 30 / (width / num);
  }

  positionString(rounded: undefined | number) {
    if (rounded) {
      return [this.x, this.y].map((x) => round(x, rounded)).join(',');
    }

    return [this.x, this.y].join(',');
  }

  zoomString(rounded: undefined | number) {
    if (rounded) {
      return round(this.zoom, rounded).toString();
    }

    return this.zoom.toString();
  }
}

/**
 * Store for enabling/listening to camera changes
 */
class CameraState {
  camera3D = $state<Camera3D>();
  camera2D = $state<Camera2D>();

  splitCamera3D = $state<Camera3D>();
  splitCamera2D = $state<Camera2D>();
}

export const cameraState = new CameraState();
