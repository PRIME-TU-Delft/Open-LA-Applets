import { Vector2 } from 'three';
import { VISIBLE_SCENE_WIDTH } from './CameraMath';
import { IDENTITY_PROJECTION, type Projection2D } from './Projection2D';

export class ViewBox {
  bottomLeft: Vector2;
  topRight: Vector2;
  margin: number;

  /**
   * ViewBox automatically sets the camera position and zoom in order to make the area defined by it always visible on any screen
   * @param bottomLeft Bottom left corner of the view box
   * @param topRight Top right corner of the view box
   * @param margin Margin of the box to extend the sides with
   */
  constructor(bottomLeft: Vector2, topRight: Vector2, margin?: number) {
    this.bottomLeft = bottomLeft;
    this.topRight = topRight;
    this.margin = margin ?? 0;
  }

  getCameraPos(projection: Projection2D = IDENTITY_PROJECTION): Vector2 {
    const screenBottomLeft = projection.toScreen(this.bottomLeft);
    const screenTopRight = projection.toScreen(this.topRight);
    return new Vector2(
      (screenBottomLeft.x + screenTopRight.x + 2 * this.margin) / 2 - this.margin,
      (screenBottomLeft.y + screenTopRight.y + 2 * this.margin) / 2 - this.margin
    );
  }

  getCameraZoom(
    width: number,
    height: number,
    projection: Projection2D = IDENTITY_PROJECTION
  ): number {
    const boxWidth = projection.xToScreen(this.topRight.x - this.bottomLeft.x) + 2 * this.margin;
    const boxHeight = projection.yToScreen(this.topRight.y - this.bottomLeft.y) + 2 * this.margin;

    if (boxWidth <= 0 || boxHeight <= 0 || width <= 0 || height <= 0) {
      return 1;
    }

    // At zoom z, the visible coordinate range is:
    //   x: VISIBLE_SCENE_WIDTH/z total
    //   y: VISIBLE_SCENE_WIDTH*(height/width)/z total
    return Math.min(
      VISIBLE_SCENE_WIDTH / boxWidth,
      (VISIBLE_SCENE_WIDTH * height) / (boxHeight * width)
    );
  }
}
