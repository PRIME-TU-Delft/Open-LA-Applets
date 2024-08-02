export default class PlaneSegment {
	segments: number;
	offset: number;
	interval: number;

	/**
	 * Plane segment for Abstract Plane
	 * @param segments number of segments
	 * @param offset offset of the first segment
	 * @param interval interval before a filled in segment is drawn
	 * @param direction horizontal or vertical
	 */
	constructor(segments: number, offset: number, interval: number) {
		this.segments = segments;
		this.offset = offset;
		this.interval = interval;
	}

	static Default = new PlaneSegment(32, 0, 1);

	/**
	 * PlaneSegments with 1 segments and 2 intervals are equivalent to a filled rectangle.
	 * @returns new PlaneSegments(1, 2, 0);
	 */
	static default(): PlaneSegment {
		return new PlaneSegment(32, 0, 1);
	}

	clone(): PlaneSegment {
		return new PlaneSegment(this.segments, this.offset, this.interval);
	}

	equals(other: PlaneSegment): boolean {
		if (!other) return false;

		return (
			this.segments === other.segments &&
			this.interval === other.interval &&
			this.offset === other.offset
		);
	}
}
