<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
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
    new Vector2(-1.5, -1), // bottom-left
    new Vector2(12, 4), // top-right
    0.25 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
    showAxisNumbersX: true,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 1,
    skipY: 1
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 2;
  let scaleY = 4;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'n';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const startN = 1;
  const endX = 15;
  const endN = 15;

  function Map(x: number): number {
    return (2 * x) / (1 + x);
  }

  const baseSize = 0.12;

  function SnapToGrid(position: Vector2): Vector2 {
    const snappedY = Math.min(Math.max(0, position.y), 1.999);
    const snappedX = 0;

    return new Vector2(snappedX, snappedY);
  }
  const draggables = [
    new Draggable(
      new Vector2(0, 1.2),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      1.5 * baseSize,
      'square'
    )
  ];

  const N = $derived(Math.ceil(draggables[0].position.y / (2 - draggables[0].position.y)));

  const appletObjects: AppletObject[] = [
    new FunctionFragment('2', PrimeColor.blue, {
      domain: { xMin: -endX, xMax: endX },
      width: baseSize,
      legendText: 'y=L',
      shape: 'square'
    }),
    new Point(new Vector2(startN, Map(startN)), PrimeColor.orange, {
      latex: 'a_1',
      legendText: toLatexText('$\\left(a_n\\right)_{n=1}^{\\infty}$'),
      radius: 1.5 * baseSize
    })
  ];
  for (let n = 2; n <= endN; n++) {
    appletObjects.push(
      new Point(new Vector2(n, Map(n)), PrimeColor.orange, {
        latex: 'a_{' + n + '}',
        radius: 1.5 * baseSize
      })
    );
  }

  const LegendL = new LegendItem('y=L-\\epsilon', PrimeColor.darkGreen, 'square');

  const LegendN = new LegendItem('n=N', PrimeColor.pink, 'square');
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={[getLegend(appletObjects)[0], LegendL, LegendN, getLegend(appletObjects)[1]]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={draggables[0].position}
    direction={new Vector2(1, 0)}
    color={PrimeColor.darkGreen}
    width={baseSize}
  />
  <InfiniteLine2D
    origin={new Vector2(N, 0)}
    direction={new Vector2(0, 1)}
    color={PrimeColor.pink}
    width={baseSize}
  />
</Canvas2D>
