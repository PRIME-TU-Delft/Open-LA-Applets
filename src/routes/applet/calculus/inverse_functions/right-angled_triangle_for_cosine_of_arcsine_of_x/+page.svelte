<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */ // For ease of creating the template applets
  import {
    Angle,
    AppletObject,
    AsymptoteFragment,
    Circle,
    FunctionFragment,
    ImplicitFunctionFragment,
    LineFragment,
    ObliqueAsymptoteFragment,
    ParameterizedFunctionFragment,
    Point,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

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
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 2.0;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 7), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbers: true,
    logarithmicX: false,
    logarithmicY: false,
    scaleX: 1,
    scaleY: 1,
    skipX: 0,
    skipY: 0
  };

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
  // {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={null}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
