import { FillType, LegendItem } from '$lib/utils/Legend';
import { AbstractFunctionFragment, AppletObject, Point, Polygon } from './TemplateAppletObjects';
import {
  AbstractFunctionFragment3D,
  AppletObject3D,
  LineSegmentObject3D,
  PointObject3D,
  PolygonObject3D
} from './TemplateAppletObjects3D';

export function getLegend(objects: AppletObject[]): LegendItem[] {
  const legendItems: LegendItem[] = [];

  for (const obj of objects) {
    if (obj instanceof AbstractFunctionFragment) {
      if (obj.legendText) {
        legendItems.push(
          new LegendItem(
            obj.legendText,
            obj.color,
            obj.shape,
            obj.isDashed ? FillType.Dashed : FillType.Full
          )
        );
      }
      if (obj.integral && obj.integral.legendText) {
        legendItems.push(
          new LegendItem(
            obj.integral.legendText,
            obj.integral.color ?? obj.color,
            obj.integral.shape ?? obj.shape,
            obj.integral.isDashed ? FillType.Dashed : FillType.Full,
            obj.color,
            1.5,
            0.5
          )
        );
      }
      if (obj.pointsLegendText.included) {
        legendItems.push(
          new LegendItem(obj.pointsLegendText.included, obj.color, obj.shape, FillType.Full)
        );
      }
      if (obj.pointsLegendText.gaps) {
        legendItems.push(
          new LegendItem(obj.pointsLegendText.gaps, obj.color, obj.shape, FillType.Border)
        );
      }
    } else if (obj instanceof Point) {
      if (obj.legendText) {
        legendItems.push(new LegendItem(obj.legendText, obj.color, obj.shape));
      }
    } else if (obj instanceof Polygon) {
      if (obj.legendText) {
        legendItems.push(
          new LegendItem(
            obj.legendText,
            obj.color,
            obj.legendShape,
            obj.fillStyle === 'dashed' ? FillType.Dashed : FillType.Full
          )
        );
      }
    }
  }

  return legendItems;
}

export function getLegend3D(objects: AppletObject3D[]): LegendItem[] {
  const legendItems: LegendItem[] = [];

  for (const obj of objects) {
    if (obj instanceof AbstractFunctionFragment3D) {
      if (obj.legendText) {
        legendItems.push(new LegendItem(obj.legendText, obj.color, obj.shape));
      }
    } else if (obj instanceof PointObject3D) {
      if (obj.legendText) {
        legendItems.push(new LegendItem(obj.legendText, obj.color, obj.shape));
      }
    } else if (obj instanceof PolygonObject3D) {
      if (obj.legendText) {
        legendItems.push(new LegendItem(obj.legendText, obj.color, obj.shape));
      }
    } else if (obj instanceof LineSegmentObject3D) {
      if (obj.legendText) {
        legendItems.push(
          new LegendItem(
            obj.legendText,
            obj.color,
            obj.shape,
            obj.isDashed == true ? FillType.Dashed : FillType.Full
          )
        );
      }
    }
  }

  return legendItems;
}
