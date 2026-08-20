<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

  let initialViewBox: ViewBox | undefined;
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
  initialViewBox = new ViewBox(
    new Vector2(0, -1), // bottom-left
    new Vector2(14, 4), // top-right
    1.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1 / 2;
  let scaleY = 1;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const func = (x: number) => Math.pow(x, 1 / 3);
  const invfunc = (x: number) => Math.pow(x, 3);
  const der = (x: number) => (1 / 3) * Math.pow(x, -2 / 3);
  const appletObjects: AppletObject[] = [
    new FunctionFragment(func, PrimeColor.blue, {
      legendText: 'f(x)=\\sqrt[3]{x}',
      width: 0.08
    }).addIncludedPoints(new Vector2(0, 0))
  ];
  const initX = 8;
  const initY = func(initX);
  function SnapToGrid(position: Vector2): Vector2 {
    const snappedY = Math.max(0.1, Number(position.y.toFixed(1)));
    const snappedX = invfunc(snappedY);

    return new Vector2(snappedX, snappedY);
  }
  const draggables = [
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      0.12
    )
  ];

  const LegendL = $derived.by(() => {
    const x = draggables[0].position.x;
    const fx = func(x);
    const invder = 3 * Math.pow(fx, 2);
    return new LegendItem('L(x)=\\$2+\\$3 (x-\\$1)', PrimeColor.orange, 'square')
      .addAutoParam(x.toFixed(3).replace(/\.?0+$/, ''), PrimeColor.darkGreen)
      .addAutoParam(fx.toFixed(1).replace(/\.?0+$/, ''), PrimeColor.darkGreen)
      .addAutoParam(
        '\\frac{1}{' + invder.toFixed(2).replace(/\.?0+$/, '') + '}',
        PrimeColor.orange
      );
  });
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={[...getLegend(appletObjects), LegendL]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={draggables[0].position}
    direction={new Vector2(1, der(draggables[0].position.x))}
    color={PrimeColor.orange}
    width={0.08}
  />
</Canvas2D>
