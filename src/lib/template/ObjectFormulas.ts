import { FillType, LegendItem } from '$lib/utils/Legend';
import { AbstractFunctionFragment, AppletObject } from './TemplateAppletObjects';

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
            obj.color,
            obj.shape,
            obj.integral.isDashed ? FillType.Dashed : FillType.Full
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
    }
  }

  return legendItems;
}
