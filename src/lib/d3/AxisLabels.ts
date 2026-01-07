import type { Vector2 } from 'three';
import type { AxisProps } from './Axis.svelte';
import type { ZoomTransform } from 'd3';
import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';

export type LabelAlign = 'start' | 'center' | 'end';

export type XLabelSide = 'top' | 'bottom';
export type YLabelSide = 'left' | 'right';

export type XLabelPosition = LabelAlign | XLabelSide | `${XLabelSide}-${LabelAlign}`; // e.g. "top-center", "bottom-end"

export type YLabelPosition = LabelAlign | YLabelSide | `${YLabelSide}-${LabelAlign}`; // e.g. "left-start", "right-center"

export type LabelProps = {
  xLabel?: string;
  yLabel?: string;
  xLabelPosition?: XLabelPosition;
  yLabelPosition?: YLabelPosition;
  yLabelRotate?: 'right' | 'left';
  size?: number;
};

export function getLabelStyles(
  labels: LabelProps | undefined,
  axis: AxisProps | undefined,
  cameraPosition: Vector2,
  cameraZoom: number,
  currentTransform: ZoomTransform,
  width: number,
  height: number
) {
  if (!labels) return { x: 'display: none;', y: 'display: none;' };

  const unitScale = width / 15;
  const margin = 12;
  const offsetBase = 25;

  const toScreen = (wX: number, wY: number) => {
    const baseX = width / 2 + (wX - cameraPosition.x) * unitScale * cameraZoom;
    const baseY = height / 2 - (wY - cameraPosition.y) * unitScale * cameraZoom;
    return currentTransform.apply([baseX, baseY]);
  };

  const parsePos = (posStr: XLabelPosition | YLabelPosition | undefined, isYAxis: boolean) => {
    const defaults = isYAxis
      ? { side: 'left', align: 'end' } // Y default: Left of axis, at Top
      : { side: 'bottom', align: 'end' }; // X default: Below axis, at Right

    if (!posStr) return defaults;

    const parts = posStr.split('-');

    if (parts.length === 1) {
      if (['top', 'bottom', 'left', 'right'].includes(parts[0])) {
        return { side: parts[0], align: defaults.align };
      }
      return { side: defaults.side, align: parts[0] };
    }

    return { side: parts[0], align: parts[1] };
  };

  const getAlignPos = (size: number, align: string, isYAxis: boolean) => {
    if (isYAxis) {
      // Y-Axis: Start=Bottom, End=Top
      switch (align) {
        case 'start':
          return size - margin * 7.5;
        case 'center':
          return size / 2 - 5 * margin;
        case 'end':
        default:
          return 3.5 * margin + 6.5 * margin; // 6.5 for the formulas
      }
    } else {
      // X-Axis: Start=Left, End=Right
      switch (align) {
        case 'start':
          return margin;
        case 'center':
          return size / 2;
        case 'end':
        default:
          return size - 4.5 * margin;
      }
    }
  };

  // --- X Label ---
  let xStyle = 'display: none;';
  if (labels.xLabel) {
    const { side, align } = parsePos(labels.xLabelPosition, false);
    const [_rawX, rawY] = toScreen(axis?.length || GRID_SIZE_2D, 0);

    const finalX = getAlignPos(width, align, false);

    // TODO: the zoom is only the default value set, try to use the current one
    // cameraState.camera2D?.zoom does not work for some reason
    const zoomScale = Math.max(1, cameraZoom);
    const offset = side === 'top' ? -offsetBase * 0.5 * zoomScale : offsetBase * 1.25 * zoomScale;

    const clampedY = Math.min(Math.max(rawY, margin), height - margin);
    const finalY = clampedY + offset;

    const xAnchor = align === 'start' ? '0' : align === 'center' ? '-50%' : '-100%';
    const yAnchor = side === 'top' ? '-100%' : '0';

    xStyle = `left: ${finalX}px; top: ${finalY}px; transform: translate(${xAnchor}, ${yAnchor});`;
  }

  // --- Y Label ---
  let yStyle = 'display: none;';
  if (labels.yLabel) {
    const { side, align } = parsePos(labels.yLabelPosition, true);
    const [rawX, _rawY] = toScreen(0, axis?.length || GRID_SIZE_2D);

    const zoomScale = Math.max(1, cameraZoom);
    const offset = side === 'right' ? offsetBase * zoomScale : -offsetBase * zoomScale;

    const clampedX = Math.min(Math.max(rawX, margin), width - margin);
    const finalX = clampedX + offset;

    const finalY = getAlignPos(height, align, true);

    const textAlign = side === 'right' ? 'left' : 'right';

    const originX = side === 'right' ? '0' : '100%';
    const originY = align === 'start' ? '0' : align === 'center' ? '50%' : '100%';

    const yAnchor = align === 'start' ? '0' : align === 'center' ? '-50%' : '-100%';
    const xAnchor = side === 'right' ? '70%' : '-100%';

    const rotation = labels.yLabelRotate
      ? labels.yLabelRotate == 'left'
        ? 'rotate(-90deg)'
        : 'rotate(90deg)'
      : '';
    const transformOrigin = `${originX} ${originY}`;

    yStyle = `left: ${finalX}px; top: ${finalY}px; transform-origin: ${transformOrigin}; transform: translate(${xAnchor}, ${yAnchor}) ${rotation}; text-align: ${textAlign};`;
  }

  return { x: xStyle, y: yStyle };
}
