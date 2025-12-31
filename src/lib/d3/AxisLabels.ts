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
  xLabel: string;
  yLabel: string;
  xLabelPosition: XLabelPosition;
  yLabelPosition: YLabelPosition;
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

  const parsePos = (posStr: string | undefined, isYAxis: boolean) => {
    const defaults = isYAxis
      ? { side: 'left', align: 'end' } // Y default: Left of axis, at Top
      : { side: 'top', align: 'end' }; // X default: Above axis, at Right

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
          return size / 2;
        case 'end':
          return margin;
        default:
          return margin;
      }
    } else {
      // X-Axis: Start=Left, End=Right
      switch (align) {
        case 'start':
          return margin;
        case 'center':
          return size / 2;
        case 'end':
          return size - margin;
        default:
          return size - margin;
      }
    }
  };

  // --- X Label ---
  let xStyle = 'display: none;';
  if (labels.xLabel) {
    const { side, align } = parsePos(labels.xLabelPosition, false);
    const [_rawX, rawY] = toScreen(axis?.length || GRID_SIZE_2D, 0);

    const finalX = getAlignPos(width, align, false);

    const offset = side === 'top' ? -offsetBase * 0.5 : offsetBase * 1.25;
    const clampedY = Math.min(Math.max(rawY, margin), height - margin);
    const finalY = clampedY + offset;

    const transY = side === 'top' ? '-100%' : '0%';

    xStyle = `left: ${finalX}px; top: ${finalY}px; transform: translate(-50%, ${transY});`;
  }

  // --- Y Label ---
  let yStyle = 'display: none;';
  if (labels.yLabel) {
    const { side, align } = parsePos(labels.yLabelPosition, true);
    const [rawX, _rawY] = toScreen(0, axis?.length || GRID_SIZE_2D);

    const offset = side === 'right' ? offsetBase : -offsetBase;
    const clampedX = Math.min(Math.max(rawX, margin), width - margin);
    const finalX = clampedX + offset;

    const finalY = getAlignPos(height, align, true);

    const textAlign = side === 'right' ? 'left' : 'right';
    const transX = side === 'right' ? '0%' : '-150%';

    yStyle = `left: ${finalX}px; top: ${finalY}px; transform: translate(${transX}, -50%); text-align: ${textAlign};`;
  }

  return { x: xStyle, y: yStyle };
}
