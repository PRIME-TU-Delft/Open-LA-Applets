<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Pendulum2D from '$lib/d3/Pendulum2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import { AppletObject, LineFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';

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
    skipY: -1,
    showAxisX: false,
    showAxisY: false
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

  let appletObjects: AppletObject[] = [];
  appletObjects.push(
    new LineFragment(
      new Vector2(0, 5),
      new Vector2(0, -1),
      PrimeColor.black + PrimeColor.opacity(0.8),
      { width: 0.03, isDashed: true }
    )
  );
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
  <TemplateComponent objects={appletObjects} />

  <Angle2D
    color={PrimeColor.black + PrimeColor.opacity(0.8)}
    startAngle={-Math.PI / 2 - (0.45 * Math.PI) / 2}
    endAngle={-Math.PI / 2 + (0.45 * Math.PI) / 2}
    origin={new Vector2(0, 5)}
    width={0.02}
    distance={5}
    hasHead={true}
  />
  <Pendulum2D bobLabel="m" stringAngle={20} />
  <Latex2D
    latex="\theta"
    color={PrimeColor.black}
    position={new Vector2(
      5 * Math.cos(-Math.PI / 2 + (0.45 * Math.PI) / 2),
      5 + 5 * Math.sin(-Math.PI / 2 + (0.45 * Math.PI) / 2)
    )}
    alignX="left"
    alignY="top"
    background={PrimeColor.white}
  />
  <Latex2D
    latex="0"
    color={PrimeColor.black}
    position={new Vector2(0, 0)}
    alignX="center"
    alignY="top"
    background={PrimeColor.white}
  />
</Canvas2D>
