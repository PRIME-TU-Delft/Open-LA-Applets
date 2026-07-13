<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';

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
  cameraPosition = new Vector2(0, 0);
  cameraZoom = 1;

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: false,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
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
  let scaleX = 5;
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
  const appletObjects: AppletObject[] = [
    new Text('\\text{Twice differentiable}', new Vector2(0, 0), PrimeColor.pstBlack, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('\\text{Continuously differentiable}', new Vector2(0, 0.65), PrimeColor.pstBlack, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('\\text{Differentiable}', new Vector2(0, 1.3), PrimeColor.pstBlack, {
      alignX: 'center',
      alignY: 'center'
    }),
    new Text('\\text{Continuous}', new Vector2(0, 1.95), PrimeColor.pstBlack, {
      alignX: 'center',
      alignY: 'center'
    })
  ];
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Circle2D
    position={new Vector2(0, 0.75)}
    radius={1.45}
    color={PrimeColor.transparent}
    fill={PrimeColor.darkGreen + PrimeColor.opacity(0.3)}
  />
  <Circle2D
    position={new Vector2(0, 0.5)}
    radius={1.1}
    color={PrimeColor.transparent}
    fill={PrimeColor.white}
  />
  <Circle2D
    position={new Vector2(0, 0.5)}
    radius={1.1}
    color={PrimeColor.transparent}
    fill={PrimeColor.yellow + PrimeColor.opacity(0.6)}
  />
  <Circle2D
    position={new Vector2(0, 0.25)}
    radius={0.75}
    color={PrimeColor.transparent}
    fill={PrimeColor.white}
  />
  <Circle2D
    position={new Vector2(0, 0.25)}
    radius={0.75}
    color={PrimeColor.transparent}
    fill={PrimeColor.raspberry + PrimeColor.opacity(0.7)}
  />
  <Circle2D
    position={new Vector2(0, 0)}
    radius={0.4}
    color={PrimeColor.transparent}
    fill={PrimeColor.white}
  />
  <Circle2D
    position={new Vector2(0, 0)}
    radius={0.4}
    color={PrimeColor.transparent}
    fill={PrimeColor.blue + PrimeColor.opacity(0.8)}
  />
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
