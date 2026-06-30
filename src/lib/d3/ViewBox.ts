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

  getCameraPos(scaleX: number = 1, scaleY: number = 1): Vector2 {
    const scaledBottomLeft = new Vector2(this.bottomLeft.x * scaleX, this.bottomLeft.y * scaleY);
    const scaledTopRight = new Vector2(this.topRight.x * scaleX, this.topRight.y * scaleY);
    return new Vector2(
      (scaledBottomLeft.x + scaledTopRight.x + 2 * this.margin) / 2 - this.margin,
      (scaledBottomLeft.y + scaledTopRight.y + 2 * this.margin) / 2 - this.margin
    );
  }

  getCameraZoom(width: number, height: number, scaleX: number = 1, scaleY: number = 1): number {
    const boxWidth = (this.topRight.x - this.bottomLeft.x) * scaleX + 2 * this.margin;
    const boxHeight = (this.topRight.y - this.bottomLeft.y) * scaleY + 2 * this.margin;

    if (boxWidth <= 0 || boxHeight <= 0 || width <= 0 || height <= 0) {
      return 1;
    }

    // At zoom z, the visible coordinate range is:
    //   x: 15/z total
    //   y: 15*(height/width)/z total
    return Math.min(15 / boxWidth, (15 * height) / (boxHeight * width));
  }
}
