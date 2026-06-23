<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment,
    LineFragment,
    Point,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  // Extra variables
  let a = 4.5;
  let fa = 5;

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
  cameraZoom = 1.5;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-0.5, -1.5), // bottom-left
    new Vector2(9.5, 8.5), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1,
    additionalTicksX: [a],
    additionalTicksY: [fa],
    showGridLinesX: false,
    showGridLinesY: false
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
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

  const func = (x: number) => {
    return (-72 / 875) * x ** 4 + (1352 / 875) * x ** 3 - (9054 / 875) * x ** 2 + (25596 / 875) * x - 604 / 25;
  };

  const appletObjects: AppletObject[] = [
    new Text('a', new Vector2(a, 0.05), PrimeColor.orange, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('f(a)', new Vector2(-0.15, fa), PrimeColor.orange, {
      alignX: 'right',
      alignY: 'center'
    }),
    new AsymptoteFragment(2, 'vertical', PrimeColor.blue),
    new AsymptoteFragment(7, 'vertical', PrimeColor.blue),
    new AsymptoteFragment(4, 'horizontal', PrimeColor.raspberry),
    new AsymptoteFragment(37865 / 6048, 'horizontal', PrimeColor.raspberry),
    new FunctionFragment(
      '-\\frac{72}{875}x^4 + \\frac{1352}{875}x^3 - \\frac{9054}{875}x^2 + \\frac{25596}{875}x - \\frac{604}{25}',
      PrimeColor.darkGreen,
      { domain: { xMin: 2, xMax: 7 }, legendText: 'y=f(x)' }
    ).addGaps(new Vector2(2, 4)).addIncludedPoints(new Vector2(7, func(7))),
    new LineFragment(new Vector2(a, 0), new Vector2(a, fa), PrimeColor.orange, { isDashed: true }),
    new LineFragment(new Vector2(0, fa), new Vector2(a, fa), PrimeColor.orange, { isDashed: true }),
    new Point(new Vector2(a, fa), PrimeColor.orange),
    new Text('\\text{Range}', new Vector2(7.7, 62057 / 12096), PrimeColor.raspberry, {
      alignX: 'left',
      alignY: 'center'
    }),
    new Text('\\text{Domain}', new Vector2((2 + 7) / 2, 37865 / 6048 + 0.7), PrimeColor.blue, {
      alignX: 'center',
      alignY: 'bottom'
    }),
    new Text('L', new Vector2(2-0.1, 0), PrimeColor.darkGreen, {
      alignX: 'right',
      alignY: 'top'
    }),
    new Text('R', new Vector2(7+0.1, 0), PrimeColor.darkGreen, {
      alignX: 'left',
      alignY: 'top'
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Vector2D
    color={PrimeColor.blue}
    origin={new Vector2((2 + 7) / 2 - 0.1, 37865 / 6048 + 0.5)}
    direction={new Vector2(5, 0)}
    length={Math.sqrt(5 ** 2 + 0 ** 2) / 2 + 0.1}
  ></Vector2D>
  <Vector2D
    color={PrimeColor.blue}
    origin={new Vector2((2 + 7) / 2, 37865 / 6048 + 0.5)}
    direction={new Vector2(-5, 0)}
    length={Math.sqrt(5 ** 2 + 0 ** 2) / 2}
  ></Vector2D>
  <Vector2D
    color={PrimeColor.raspberry}
    origin={new Vector2(7.5, 62057 / 12096 - 0.1)}
    direction={new Vector2(0, 1)}
    length={Math.sqrt((13673 / 6048) ** 2 + 0 ** 2) / 2 + 0.1}
  ></Vector2D>
  <Vector2D
    color={PrimeColor.raspberry}
    origin={new Vector2(7.5, 62057 / 12096)}
    direction={new Vector2(0, -1)}
    length={Math.sqrt((13673 / 6048) ** 2 + 0 ** 2) / 2}
  ></Vector2D>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
