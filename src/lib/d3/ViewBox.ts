import { Vector2 } from 'three';

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

  getCameraPos(): Vector2 {
    return new Vector2(
      (this.bottomLeft.x + this.topRight.x + 2 * this.margin) / 2 - this.margin,
      (this.bottomLeft.y + this.topRight.y + 2 * this.margin) / 2 - this.margin
    );
  }

  getCameraZoom(width: number, height: number): number {
    const boxWidth = this.topRight.x - this.bottomLeft.x + 2 * this.margin;
    const boxHeight = this.topRight.y - this.bottomLeft.y + 2 * this.margin;

    if (boxWidth <= 0 || boxHeight <= 0 || width <= 0 || height <= 0) {
      return 1;
    }

    // At zoom z, the visible coordinate range is:
    //   x: 15/z total
    //   y: 15*(height/width)/z total
    return Math.min(15 / boxWidth, (15 * height) / (boxHeight * width));
  }
}
