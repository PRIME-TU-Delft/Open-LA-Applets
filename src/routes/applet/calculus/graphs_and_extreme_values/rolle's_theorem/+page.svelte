<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';

  let initialViewBox: ViewBox | undefined;
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

  const a = 1;
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
  function Function1(_x: number): number {
    return 2;
  }
  function Function2(x: number): number {
    return -0.5 * (x - c) ** 2 + 2.5;
  }
  function Function3(x: number): number {
    return 0.5 * (x - c) ** 2 + 0.5;
  }
  function Function4(x: number): number {
    return (
      ((2 * (B - A)) / (c - d) ** 3) * ((1 / 3) * x ** 3 - ((c + d) / 2) * x ** 2 + c * d * x) - 3
    );
  }
  const appletObjectsShared: AppletObject[] = [
    new Text('\\LARGE a', new Vector2(a, -0.1), PrimeColor.grey, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('\\LARGE b', new Vector2(b, -0.1), PrimeColor.grey, {
      alignX: 'center',
      alignY: 'top'
    }),
    new Text('\\LARGE c', new Vector2(c, -0.1), PrimeColor.grey, {
      alignX: 'center',
      alignY: 'top'
    })
  ];
  const appletObjects1: AppletObject[] = [
    new FunctionFragment((x: number) => Function1(x), PrimeColor.blue, {
      width: 0.08,
      domain: { xMin: a, xMax: b }
    }).addIncludedPoints(
      [new Vector2(a, Function1(a)), new Vector2(b, Function1(b))],
      undefined,
      0.1
    )
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment((x: number) => Function2(x), PrimeColor.raspberry, {
      width: 0.08,
      domain: { xMin: a, xMax: b }
    }).addIncludedPoints(
      [new Vector2(a, Function2(a)), new Vector2(b, Function2(b))],
      undefined,
      0.1
    ),
    new FunctionFragment((_x: number) => Function2(c), PrimeColor.black, {
      width: 0.04,
      domain: { xMin: c - 0.5, xMax: c + 0.5 },
      isDashed: true
    }),
    new Point(new Vector2(c, Function2(c)), PrimeColor.black, {
      radius: 0.08
    })
  ];
  const appletObjects3: AppletObject[] = [
    new FunctionFragment((x: number) => Function3(x), PrimeColor.darkGreen, {
      width: 0.08,
      domain: { xMin: a, xMax: b }
    }).addIncludedPoints(
      [new Vector2(a, Function3(a)), new Vector2(b, Function3(b))],
      undefined,
      0.1
    ),
    new FunctionFragment((_x: number) => Function3(c), PrimeColor.black, {
      width: 0.04,
      domain: { xMin: c - 0.5, xMax: c + 0.5 },
      isDashed: true
    }),
    new Point(new Vector2(c, Function3(c)), PrimeColor.black, {
      radius: 0.08
    })
  ];
  const appletObjects4: AppletObject[] = [
    new FunctionFragment((x: number) => Function4(x), PrimeColor.purple, {
      domain: { xMin: a, xMax: b },
      width: 0.08
    }).addIncludedPoints(
      [new Vector2(a, Function4(a)), new Vector2(b, Function4(b))],
      undefined,
      0.1
    ),
    new FunctionFragment((_x: number) => Function4(c), PrimeColor.black, {
      width: 0.04,
      domain: { xMin: c - 0.5, xMax: c + 0.5 },
      isDashed: true
    }),
    new Point(new Vector2(c, Function4(c)), PrimeColor.black, {
      radius: 0.08
    }),
    new FunctionFragment((_x: number) => Function4(d), PrimeColor.black, {
      width: 0.04,
      domain: { xMin: d - 0.5, xMax: d + 0.5 },
      isDashed: true
    }),
    new Point(new Vector2(d, Function4(d)), PrimeColor.black, {
      radius: 0.08
    })
  ];

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-2, -1), // bottom-left
    new Vector2(6, 3.5), // top-right
    0.5 // margin
  );
  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: -1,
    additionalTicksX: [a, b, c]
  };
</script>

<CanvasGrid rows={2} columns={2}>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects1} />
    <TemplateComponent objects={appletObjectsShared} />
  </GridCanvas2D>

  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects2} />
    <TemplateComponent objects={appletObjectsShared} />
  </GridCanvas2D>

  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects3} />
    <TemplateComponent objects={appletObjectsShared} />
  </GridCanvas2D>

  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects4} />
    <TemplateComponent objects={appletObjectsShared} />
  </GridCanvas2D>
</CanvasGrid>
