<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

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
  cameraZoom = 1.5;

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
  function EvenPlusOdd(x: number): number {
    return x ** 2 + x;
  }
  function snapToFunction(position: Vector2) {
    let x = Number(position.x.toFixed(1));
    let y = EvenPlusOdd(x);
    return new Vector2(x, y);
  }
  const appletObjects: AppletObject[] = [new FunctionFragment(EvenPlusOdd, PrimeColor.blue)];

  const draggables = [
    new Draggable(new Vector2(1.1, EvenPlusOdd(1.1)), PrimeColor.orange, undefined, snapToFunction)
  ];
  const xD = $derived(draggables[0].position.x);

  function legendPosition() {
    const x = draggables[0].position.x;
    const xString = x.toFixed(1).replace('.0', '');
    return `\\left(${xString}, f(${xString})\\right)`;
  }
  function legendPositionEven() {
    const x = draggables[0].position.x;
    const xEven = -draggables[0].position.x;
    const xString = x.toFixed(1).replace('.0', '');
    const xEvenString = xEven.toFixed(1).replace('.0', '');
    return `\\left(${xEvenString}, f(${xString})\\right)`;
  }
  function legendPositionOdd() {
    const x = draggables[0].position.x;
    const xOdd = -draggables[0].position.x;
    const xString = x.toFixed(1).replace('.0', '');
    const xOddString = xOdd.toFixed(1).replace('.0', '');
    return `\\left(${xOddString}, -f(${xString})\\right)`;
  }

  const legendItems = $derived([
    new LegendItem('f(x)=x^2+x', PrimeColor.blue),
    new LegendItem(legendPosition(), PrimeColor.orange),
    new LegendItem(legendPositionEven(), PrimeColor.yellow, 'square'),
    new LegendItem(legendPositionOdd(), PrimeColor.raspberry, 'triangle')
  ]);
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <Line2D
    start={new Vector2(-xD, EvenPlusOdd(xD))}
    end={new Vector2(xD, EvenPlusOdd(xD))}
    color={PrimeColor.yellow}
    isDashed={true}
  />
  <Point2D position={new Vector2(-xD, EvenPlusOdd(xD))} color={PrimeColor.yellow} shape="square" />
  <Line2D
    start={new Vector2(-xD, -EvenPlusOdd(xD))}
    end={new Vector2(xD, EvenPlusOdd(xD))}
    color={PrimeColor.raspberry}
    isDashed={true}
  />
  <Point2D
    position={new Vector2(-xD, -EvenPlusOdd(xD))}
    color={PrimeColor.raspberry}
    shape="triangle"
  />
</Canvas2D>
