export class PlaneSegments {
  segments: number;
  offset: number;
  interval: number;
  direction: 'horizontal' | 'vertical';

  /**
   * Plane segment for Abstract Plane
   * @param segments number of segments
   * @param offset offset of the first segment
   * @param interval interval before a filled in segment is drawn
   * @param direction horizontal or vertical
   */
  constructor(
    segments: number,
    offset: number,
    interval: number,
    direction: 'horizontal' | 'vertical' = 'horizontal'
  ) {
    this.segments = segments;
    this.offset = offset;
    this.interval = interval;
    this.direction = direction;
  }

  /**
   * PlaneSegments with 1 segments and 2 intervals are equivalent to a filled rectangle.
   * @returns new PlaneSegments(1, 2, 0);
   */
  static default(): PlaneSegments {
    return new PlaneSegments(2, 0, 1, 'horizontal');
  }

  clone(): PlaneSegments {
    return new PlaneSegments(this.segments, this.offset, this.interval, this.direction);
  }

  equals(other: PlaneSegments): boolean {
    if (!other) return false;

    return (
      this.segments === other.segments &&
      this.direction === other.direction &&
      this.interval === other.interval &&
      this.offset === other.offset
    );
  }
}
