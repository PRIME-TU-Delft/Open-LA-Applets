<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { LegendItem } from '$lib/utils/Legend';
  import Point2D from '$lib/d3/Point2D.svelte';

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
    skipX: 1,
    skipY: 1
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
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const Conventions = [
    'Left-continuous convention',
    'Half-maximum convention',
    'Right-continuous convention'
  ];
  const controls = Controls.addDropdown(Conventions[2], Conventions, PrimeColor.yellow);
  const appletObjects: AppletObject[] = [
    new FunctionFragment('0', PrimeColor.blue, {
      domain: { xMax: 0 }
    }).addGaps(new Vector2(0, 0)),
    new FunctionFragment('1', PrimeColor.blue, {
      domain: { xMin: 0 }
    }).addGaps(new Vector2(0, 1))
  ];

  function legendText() {
    const convention = controls[0];
    if (convention === Conventions[0]) {
      return 'H(t)=\\left\\{\\begin{array}{lll}1,\\qquad&\\text{if }&t> 0,\\\\ 0,&\\text{if }&t\\leq0,\\end{array}\\right.';
    } else if (convention === Conventions[1]) {
      return 'H(t)=\\left\\{\\begin{array}{lll}1,\\qquad&\\text{if }&t> 0,\\\\\\frac{1}{2},\\qquad&\\text{if }&t= 0,\\\\ 0,&\\text{if }&t<0,\\end{array}\\right.';
    } else if (convention === Conventions[2]) {
      return 'H(t)=\\left\\{\\begin{array}{lll}1,\\qquad&\\text{if }&t\\geq 0,\\\\ 0,&\\text{if }&t<0,\\end{array}\\right.';
    }
    return '';
  }

  const legendItems = $derived([new LegendItem(legendText(), PrimeColor.blue)]);
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  legendFormulaPosition="top-left"
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  {#if controls[0] === Conventions[0]}
    <Point2D position={new Vector2(0, 0)} color={PrimeColor.blue} />
  {/if}
  {#if controls[0] === Conventions[1]}
    <Point2D position={new Vector2(0, 0.5)} color={PrimeColor.blue} />
  {/if}
  {#if controls[0] === Conventions[2]}
    <Point2D position={new Vector2(0, 1)} color={PrimeColor.blue} />
  {/if}
</Canvas2D>
