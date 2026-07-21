<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ImplicitFunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

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
  cameraPosition = new Vector2(0.5, 0);
  cameraZoom = 1.5;

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
  let scaleY = 2;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment('x^2 + y^2 = 1', PrimeColor.blue, {
      legendText: 'x^2 + y^2 = 1',
      maxDepth: 2,
      width: 0.08
    })
  ];
  const initX = 1 / 2;
  const initY = Math.sqrt(1 - initX ** 2);
  const draggables = [
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.orange,
      undefined,
      snapCircle,
      undefined,
      undefined,
      0.12
    )
  ];
  function snapCircle(pos: Vector2): Vector2 {
    const x = pos.x;
    const y = pos.y;
    const angle = Math.atan2(y, x);
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }
</script>

<Canvas2D
  {draggables}
  {cameraPosition}
  {cameraZoom}
  legendItems={[
    ...getLegend(appletObjects),
    new LegendItem('\\text{Tangent line}', PrimeColor.darkGreen)
  ]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const x = draggables[0].position.x}
  {@const y = draggables[0].position.y}
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    origin={new Vector2(x, y)}
    direction={new Vector2(-y, x)}
    color={PrimeColor.darkGreen}
    width={0.08}
  />
</Canvas2D>
