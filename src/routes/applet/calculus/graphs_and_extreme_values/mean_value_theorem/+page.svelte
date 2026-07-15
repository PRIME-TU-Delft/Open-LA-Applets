<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { getLegend } from '$lib/template/ObjectFormulas';

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

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

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

  const a = 0.5;
  const b = 4;
  const c = 3.1;
  const d = 1.7;
  const A = 1;
  const B = 3;

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function Function4(x: number): number {
    return (
      ((2 * (B - A)) / (c - d) ** 3) * ((1 / 3) * x ** 3 - ((c + d) / 2) * x ** 2 + c * d * x) - 2.7
    );
  }

  function LinearFunction(x: number): number {
    return ((Function4(b) - Function4(a)) / (b - a)) * (x - a) + Function4(a);
  }

  // Set the two points where the original function has the same slope as the secant line

  const x1 =
    (c + d) / 2 -
    0.5 * Math.sqrt((c + d) ** 2 + (4 / 3) * (a ** 2 + a * b + b ** 2) - 2 * (c + d) * (a + b));
  const x2 =
    (c + d) / 2 +
    0.5 * Math.sqrt((c + d) ** 2 + (4 / 3) * (a ** 2 + a * b + b ** 2) - 2 * (c + d) * (a + b));

  const appletObjectsShared: AppletObject[] = [
    new Text('\\huge a', new Vector2(a, -0.1), PrimeColor.black, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('\\huge b', new Vector2(b, -0.1), PrimeColor.black, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('\\huge c', new Vector2(x1, -0.1), PrimeColor.black, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('\\huge d', new Vector2(x2, -0.1), PrimeColor.black, {
      alignX: 'center',
      alignY: 'top'
    })
  ];
  const appletObjects4: AppletObject[] = [
    new FunctionFragment((x: number) => LinearFunction(x), PrimeColor.raspberry, {
      domain: { xMin: a, xMax: b },
      width: 0.08,
      legendText: 'L(x)'
    }),
    new FunctionFragment((x: number) => Function4(x), PrimeColor.blue, {
      domain: { xMin: a, xMax: b },
      width: 0.08,
      legendText: 'f(x)'
    }).addIncludedPoints(
      [new Vector2(a, Function4(a)), new Vector2(b, Function4(b))],
      undefined,
      0.1
    ),
    new Point(new Vector2(x1, Function4(x1)), PrimeColor.green, {
      legendText: '(c,f(c))',
      radius: 0.08
    }),
    new Point(new Vector2(x2, Function4(x2)), PrimeColor.yellow, {
      legendText: '(d,f(d))',
      radius: 0.08
    }),
    new FunctionFragment(
      (x: number) => ((Function4(b) - Function4(a)) / (b - a)) * (x - x1) + Function4(x1),
      PrimeColor.green,
      {
        width: 0.04,
        domain: { xMin: x1 - 0.5, xMax: x1 + 0.5 },
        isDashed: true
      }
    ),
    new FunctionFragment(
      (x: number) => ((Function4(b) - Function4(a)) / (b - a)) * (x - x2) + Function4(x2),
      PrimeColor.yellow,
      {
        width: 0.04,
        domain: { xMin: x2 - 0.5, xMax: x2 + 0.5 },
        isDashed: true
      }
    )
  ];

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  cameraPosition = new Vector2(3, 1.2);
  cameraZoom = 2;

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1,
    additionalTicksX: [a, b, x1, x2]
  };
  const legend = getLegend(appletObjects4);
  const orderedLegend = [1, 0, 2, 3].map((i) => legend[i]);
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendItems={orderedLegend}
>
  <TemplateComponent objects={appletObjects4} />
  <TemplateComponent objects={appletObjectsShared} />
</Canvas2D>
