import { Vector3 } from 'three';

export class Label {
  title = '';
  position: Vector3;
  size: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;

  isVector = false;
  private originalTitle = '';

  constructor(
    title: string,
    color = 'white',
    size = 0.1,
    position: Vector3 = new Vector3(0, 0, 0)
  ) {
    this.title = title;
    this.originalTitle = title;
    this.color = color;
    this.position = position;
    this.size = size;
    this.strokeColor = 'white';
    this.strokeWidth = 0;

    // Add unicode character for vector arrow
    if (this.isVector) {
      this.title += String.fromCharCode(0x20d7);
    }
  }

  static default() {
    return new Label('');
  }

  setVector(to = true) {
    if (!to) return this.resetVector();

    this.isVector = true;

    // if label is vector and title is not already set to vector
    //  -> add unicode character for vector arrow
    if (this.originalTitle == this.title) {
      this.title += String.fromCharCode(0x20d7);
    }

    return this;
  }

  resetVector() {
    this.isVector = false;

    this.title = this.originalTitle;

    return this;
  }

  setStroke(color = this.color, width = 2) {
    this.strokeColor = color;
    this.strokeWidth = width;
    return this;
  }

  resetStroke() {
    this.strokeColor = 'white';
    this.strokeWidth = 0;
    return this;
  }

  clone() {
    return new Label(this.title, this.color, this.size, this.position);
  }

  equals(label: Label) {
    if (!label) return false;

    return (
      this.title === label.title && this.position.equals(label.position) && this.size === label.size
    );
  }
}
