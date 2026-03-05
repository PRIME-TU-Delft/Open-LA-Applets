import { LegendItem } from '$lib/utils/Legend';
import { AppletObject, FunctionFragment } from './TemplateAppletObjects';

export function getLegend(objects: AppletObject[]): LegendItem[] {
  const legendItems: LegendItem[] = [];

  for (const obj of objects) {
    if (obj instanceof FunctionFragment) {
      if (obj.legendText) {
        legendItems.push(new LegendItem(obj.legendText, obj.color, obj.shape, obj.legendFill));
      }
    }
  }

  return legendItems;
}
