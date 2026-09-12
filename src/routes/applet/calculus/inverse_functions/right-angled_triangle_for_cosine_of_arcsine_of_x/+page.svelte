<script lang="ts">
  // For ease of creating the template applets
  import { Angle, AppletObject, Polygon, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used
  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-1, -1), // bottom-left
    new Vector2(6, 4), // top-right
    0 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = '';
  yAxisLabel = '';

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new Polygon([new Vector2(0, 0), new Vector2(4, 0), new Vector2(4, 3)], PrimeColor.blue),
    new Angle(new Vector2(4, 0), Math.PI / 2, Math.PI, PrimeColor.raspberry, { distance: 0.5 }),
    new Angle(new Vector2(0, 0), 0, Math.atan2(3, 4), PrimeColor.darkGreen, { distance: 0.75 }),
    new Text(
      'y',
      new Vector2(Math.cos((0.75 * Math.atan2(3, 4)) / 2), 0.75 * Math.sin(Math.atan2(3, 4) / 2)),
      PrimeColor.darkGreen,
      { alignX: 'left', alignY: 'bottom' }
    ),
    new Text('x', new Vector2(4.15, 1.5), PrimeColor.blue, { alignX: 'left', alignY: 'center' }),
    new Text('\\sqrt{1-x^2}', new Vector2(2, -0.15), PrimeColor.blue, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('1', new Vector2(2.05, 1.55), PrimeColor.blue, { alignX: 'right', alignY: 'bottom' })
  ];
</script>

<Canvas2D
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
