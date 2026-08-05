<script lang="ts">
  // For ease of creating the template applets
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';

  let cameraPosition: Vector2 | undefined;
  let cameraPosition2: Vector2 | undefined;
  let cameraPosition3: Vector2 | undefined;
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
  cameraPosition = new Vector2(1.5, 0.5);
  cameraZoom = 1;
  cameraPosition2 = new Vector2(1.5, 0.25);
  cameraPosition3 = new Vector2(0.5, 0.25);
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
  let scaleX = 4;
  let scaleY = 4;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const Transform = (x: number) => Math.log(x);
  const Integrand = (x: number) => Math.log(x) / x;
  const IntegrandU = (u: number) => u;
  function SnapTopA(position: Vector2): Vector2 {
    // increments of 0.01, minimum 0.01, maximum right point of the INTERVAL (Math.E initially) minus 0.01
    let x = Number(position.x.toFixed(2));
    x = Math.max(x, 0.01);
    x = Math.min(x, draggablePoint[1].value.x - 0.01);
    return new Vector2(x, 0);
  }
  function SnapTopB(position: Vector2): Vector2 {
    // increments of 0.01, no maximum, minimum left point of the INTERVAL (1 initially) plus 0.01
    let x = Number(position.x.toFixed(2));
    x = Math.max(x, draggablePoint[0].value.x + 0.01);
    return new Vector2(x, 0);
  }
  const initA = 1;
  const initB = Math.E;
  const draggablePoint = [
    new Draggable(
      new Vector2(initA, 0),
      PrimeColor.raspberry,
      undefined,
      SnapTopA,
      undefined,
      undefined,
      0.2
    ),
    new Draggable(
      new Vector2(initB, 0),
      PrimeColor.raspberry,
      undefined,
      SnapTopB,
      undefined,
      undefined,
      0.2
    )
  ];
  const legendItems = $derived.by(() => {
    const a = draggablePoint[0].position.x;
    const b = draggablePoint[1].position.x;
    const stringb = Math.abs(b - Math.E) < 0.01 ? 'e' : '\\$2';
    return [
      new LegendItem('u=\\ln(x)', PrimeColor.blue, 'square'),
      new LegendItem(
        '\\int_{\\$1}^{' + stringb + '}\\frac{\\ln(x)}{x}\\,dx',
        PrimeColor.raspberry,
        'circle',
        undefined,
        undefined,
        undefined,
        0.5
      )
        .addAutoParam(a, PrimeColor.raspberry)
        .addAutoParam(b.toFixed(2), PrimeColor.raspberry),
      new LegendItem(
        '\\int_{\\ln(\\$1)}^{\\ln(' + stringb + ')}u\\,du',
        PrimeColor.darkGreen,
        'diamond',
        undefined,
        undefined,
        undefined,
        0.5
      )
        .addAutoParam(a, PrimeColor.raspberry)
        .addAutoParam(b.toFixed(2), PrimeColor.raspberry)
    ];
  });
</script>

<CanvasGrid rows={2} columns={4} {legendItems} legendFormulaPosition="top-left">
  <GridCanvas2D
    draggables={[draggablePoint[0], draggablePoint[1]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: 'u' }}
    {axis}
    {scaleX}
    {scaleY}
    gridColumn="2 / span 2"
    gridRow="1"
  >
    <Line2D
      start={new Vector2(draggablePoint[0].value.x, 0)}
      end={new Vector2(draggablePoint[0].value.x, Transform(draggablePoint[0].value.x))}
      color={PrimeColor.raspberry}
      width={0.06}
      isDashed
    />
    <Line2D
      start={new Vector2(draggablePoint[1].value.x, 0)}
      end={new Vector2(draggablePoint[1].value.x, Transform(draggablePoint[1].value.x))}
      color={PrimeColor.raspberry}
      width={0.06}
      isDashed
    />
    <Line2D
      start={new Vector2(draggablePoint[0].value.x, Transform(draggablePoint[0].value.x))}
      end={new Vector2(0, Transform(draggablePoint[0].value.x))}
      color={PrimeColor.darkGreen}
      width={0.06}
      isDashed
    />
    <Line2D
      start={new Vector2(draggablePoint[1].value.x, Transform(draggablePoint[1].value.x))}
      end={new Vector2(0, Transform(draggablePoint[1].value.x))}
      color={PrimeColor.darkGreen}
      width={0.06}
      isDashed
    />
    <ExplicitFunction2D func={Transform} color={PrimeColor.blue} width={0.06} isDashed />
    <ExplicitFunction2D
      func={Transform}
      color={PrimeColor.blue}
      width={0.12}
      xMin={draggablePoint[0].value.x}
      xMax={draggablePoint[1].value.x}
    />

    <Point2D
      position={new Vector2(draggablePoint[0].value.x, Transform(draggablePoint[0].value.x))}
      color={PrimeColor.blue}
      radius={0.16}
      shape="square"
    />
    <Point2D
      position={new Vector2(draggablePoint[1].value.x, Transform(draggablePoint[1].value.x))}
      color={PrimeColor.blue}
      radius={0.16}
      shape="square"
    />
    <Line2D
      start={new Vector2(draggablePoint[0].value.x, 0)}
      end={new Vector2(draggablePoint[1].value.x, 0)}
      color={PrimeColor.raspberry}
      width={0.12}
    />
    <Line2D
      start={new Vector2(0, Transform(draggablePoint[0].value.x))}
      end={new Vector2(0, Transform(draggablePoint[1].value.x))}
      color={PrimeColor.darkGreen}
      width={0.12}
    />
    <Point2D
      position={new Vector2(0, Transform(draggablePoint[0].value.x))}
      color={PrimeColor.darkGreen}
      radius={0.16}
      shape="diamond"
    />
    <Point2D
      position={new Vector2(0, Transform(draggablePoint[1].value.x))}
      color={PrimeColor.darkGreen}
      radius={0.16}
      shape="diamond"
    />
  </GridCanvas2D>
  <GridCanvas2D
    cameraPosition={cameraPosition2}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridColumn="1 / span 2"
    gridRow="2"
  >
    <ExplicitFunction2D func={Integrand} color={PrimeColor.raspberry} width={0.06} isDashed />
    <ExplicitFunction2D
      func={Integrand}
      color={PrimeColor.raspberry}
      width={0.12}
      xMin={draggablePoint[0].value.x}
      xMax={draggablePoint[1].value.x}
      integral={{
        xLeft: draggablePoint[0].value.x,
        xRight: draggablePoint[1].value.x,
        fillStyle: 'full'
      }}
    />
    <Point2D
      position={new Vector2(draggablePoint[0].value.x, Integrand(draggablePoint[0].value.x))}
      color={PrimeColor.raspberry}
      radius={0.16}
    />
    <Point2D
      position={new Vector2(draggablePoint[1].value.x, Integrand(draggablePoint[1].value.x))}
      color={PrimeColor.raspberry}
      radius={0.16}
    />
  </GridCanvas2D>

  <GridCanvas2D
    cameraPosition={cameraPosition3}
    {cameraZoom}
    labels={{ xLabel: 'u', yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridColumn="3 / span 2"
    gridRow="2"
  >
    <ExplicitFunction2D
      func={(x: number) => IntegrandU(x)}
      color={PrimeColor.darkGreen}
      width={0.06}
      isDashed
    />
    <ExplicitFunction2D
      func={(x: number) => IntegrandU(x)}
      color={PrimeColor.darkGreen}
      width={0.12}
      xMin={Transform(draggablePoint[0].value.x)}
      xMax={Transform(draggablePoint[1].value.x)}
      integral={{
        xLeft: Transform(draggablePoint[0].value.x),
        xRight: Transform(draggablePoint[1].value.x),
        fillStyle: 'full'
      }}
    />
    <Point2D
      position={new Vector2(
        Transform(draggablePoint[0].value.x),
        IntegrandU(Transform(draggablePoint[0].value.x))
      )}
      color={PrimeColor.darkGreen}
      radius={0.16}
      shape="diamond"
    />
    <Point2D
      position={new Vector2(
        Transform(draggablePoint[1].value.x),
        IntegrandU(Transform(draggablePoint[1].value.x))
      )}
      color={PrimeColor.darkGreen}
      radius={0.16}
      shape="diamond"
    />
  </GridCanvas2D>
</CanvasGrid>
