<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import MassSpring2D from '$lib/d3/MassSpring2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { AppletObject, Polygon } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import FillBetweenFunctions2D from '$lib/d3/FillBetweenFunctions2D.svelte';

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
    showOrigin: false,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
    logarithmicX: false,
    logarithmicY: false,
    skipX: -1,
    skipY: 0,
    showAxisX: false
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

  const appletObjects: AppletObject[] = [
    new Polygon(
      [new Vector2(-2, 3), new Vector2(-4, 3), new Vector2(-4, -3), new Vector2(-2, -3)],
      PrimeColor.grey
    ),
    new Polygon(
      [new Vector2(2, 3), new Vector2(4, 3), new Vector2(4, -3), new Vector2(2, -3)],
      PrimeColor.grey
    )
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    color={PrimeColor.black + PrimeColor.opacity(0.5)}
  />
  <MassSpring2D massLabel="m" />
  <MassSpring2D center={3} massLocation={-2} ceilingTop={4} massLabel="m" />
  <Vector2D color={PrimeColor.black} origin={new Vector2(-1, -1)} direction={new Vector2(0, -1)} />
  <Latex2D
    latex="u"
    color={PrimeColor.black}
    position={new Vector2(-1.35, -1.3)}
    alignX="center"
    alignY="center"
  />
  <Latex2D
    latex="0"
    color={PrimeColor.black}
    position={new Vector2(-0.35, 0.05)}
    alignX="center"
    alignY="center"
    background={PrimeColor.white}
  />
  <FillBetweenFunctions2D
    func1={(_x: number) => -3}
    func2={(x: number) => 2 + 0.1 * Math.sin((3 / 2) * Math.PI * x)}
    // Curve that has two local maxima and one local minimum in the interval (2, 4), has negative slope at x=2 and positive slope at x=4 and oscillates around 2
    color1={PrimeColor.blue}
    color2={PrimeColor.raspberry}
    width={0.05}
    xMin={0}
    xMax={0}
    integral={{
      xLeft: 2,
      xRight: 4,
      fillStyle: 'full',
      color: PrimeColor.green,
      opacity: 0.3
    }}
  />
  <FillBetweenFunctions2D
    func1={(_x: number) => -3}
    func2={(x: number) => 2 + 0.1 * Math.sin((3 / 2) * Math.PI * (x - -6))}
    // Curve that has two local maxima and one local minimum in the interval (2, 4), has negative slope at x=2 and positive slope at x=4 and oscillates around 2
    color1={PrimeColor.blue}
    color2={PrimeColor.raspberry}
    width={0.05}
    xMin={0}
    xMax={0}
    integral={{
      xLeft: -4,
      xRight: -2,
      fillStyle: 'full',
      color: PrimeColor.green,
      opacity: 0.3
    }}
  />
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
