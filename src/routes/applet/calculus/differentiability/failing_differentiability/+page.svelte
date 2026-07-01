<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';

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
  const a = 1;
  const b = 1;
  cameraPosition = new Vector2(a, b);
  cameraZoom = 4;

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
    skipX: 0,
    skipY: 0
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
  xAxisLabel = '';
  yAxisLabel = '';

  // ##############
  // APPLET OBJECTS
  // ##############
  function Function1(x: number): number {
    if (x < 0) {
      return -Math.pow(-x, 1 / 3);
    } else if (x > 0) {
      return Math.pow(x, 1 / 3);
    } else {
      return 0;
    }
  }
  function Function2(x: number): number {
    if (x < 0) {
      return Math.pow(-x, 1 / 2);
    } else if (x > 0) {
      return Math.pow(x, 1 / 2);
    } else {
      return 0;
    }
  }
  function Function3left(x: number): number {
    return -(x + 2) * (x - 2) - 2;
  }
  function Function3right(x: number): number {
    return (x + 2) * (x - 2) + 2;
  }
  const appletObjects1: AppletObject[] = [
    new FunctionFragment((x: number) => Function1(x - a) + b, PrimeColor.blue, {
      legendText: 'f(x)',
      width: 0.08
    }),
    new Text('\\Huge a', new Vector2(a, -0.1), PrimeColor.black, {
      alignX: 'center',
      alignY: 'top'
    })
  ];
  const appletObjects2: AppletObject[] = [
    new FunctionFragment((x: number) => Function2(x - a) + b, PrimeColor.raspberry, {
      legendText: 'g(x)',
      width: 0.08
    }),
    new Text('\\Huge b', new Vector2(a, -0.1), PrimeColor.black, {
      alignX: 'center',
      alignY: 'top'
    })
  ];
  const appletObjects3: AppletObject[] = [
    new FunctionFragment((x: number) => Function3left(x - a) + b, PrimeColor.darkGreen, {
      legendText: 'h(x)',
      domain: { xMax: a },
      width: 0.08
    }).addIncludedPoints(new Vector2(a, Function3left(0) + b), undefined, 0.1),
    new FunctionFragment((x: number) => Function3right(x - a) + b, PrimeColor.darkGreen, {
      domain: { xMin: a },
      width: 0.08
    }).addGaps(new Vector2(a, Function3right(0) + b), undefined, 0.1),
    new Text('\\Huge c', new Vector2(a, -0.1), PrimeColor.black, {
      alignX: 'center',
      alignY: 'top'
    })
  ];
</script>

<CanvasGrid rows={1} columns={3}>
  <GridCanvas2D
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects1} />
  </GridCanvas2D>

  <GridCanvas2D
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects2} />
  </GridCanvas2D>

  <GridCanvas2D
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <TemplateComponent objects={appletObjects3} />
  </GridCanvas2D>
</CanvasGrid>
