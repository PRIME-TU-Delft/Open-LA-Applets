<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText, withSign } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { Controls } from '$lib/controls/Controls';
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
  cameraPosition = new Vector2(2, 1);
  cameraZoom = 2.5;

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
  const Integrand = (x: number) => Math.cos(x) * Math.exp(Math.sin(x));
  const Integral = (x: number) => Math.exp(Math.sin(x)); // Integral of Integrand from 0 to x
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Integrand, PrimeColor.raspberry, {
      legendText: 'f(x)=\\cos(x)e^{\\sin(x)}',
      width: 0.06
    })
  ];
  function Snap(position: Vector2): Vector2 {
    const x = Number(position.x.toFixed(2)); // in increments of 0.01;
    draggablePoint[1].value = new Vector2(x, Integral(x) + controls[0]);
    return new Vector2(x, Integrand(x));
  }
  function Snap2(position: Vector2): Vector2 {
    const x = Number(position.x.toFixed(2)); // in increments of 0.01;
    draggablePoint[0].value = new Vector2(x, Integrand(x));
    return new Vector2(x, Integral(x) + controls[0]);
  }
  function Snap3(C: number): void {
    const x = draggablePoint[0].position.x;
    draggablePoint[1].value = new Vector2(x, Integral(x) + C);
  }
  const initX = 1;
  const controls = Controls.addSlider(-0.5, -2, 2, 0.1, PrimeColor.blue, {
    label: toLatexText('$C=$'),
    valueFn: (v: number) => toLatexText("$"+v.toFixed(1).replace('.0', '')+"$"),
    animationStep: 0.1,
    onChange: Snap3
  });
  const draggablePoint = [
    new Draggable(
      new Vector2(initX, Integrand(initX)),
      PrimeColor.orange,
      undefined,
      Snap,
      undefined,
      undefined,
      0.14
    ),
    new Draggable(
      new Vector2(initX, Integral(initX) + controls[0]),
      PrimeColor.orange,
      undefined,
      Snap2,
      undefined,
      undefined,
      0.14
    )
  ];
  const LegendIntegral = $derived.by(() => {
    const C = controls[0];
    const Dollar1 = C != 0 ? '\\$1' : '';
    const latex = `\\int f(x)\\,dx= e^{\\sin(x)}${Dollar1}`;
    return new LegendItem(latex, PrimeColor.darkGreen).addAutoParam(
      withSign(C, 1).replace('.0', ''),
      PrimeColor.blue
    );
  });
</script>

<CanvasGrid
  rows={1}
  columns={2}
  legendItems={[...getLegend(appletObjects), LegendIntegral]}
  legendFormulaPosition="top-left"
  {controls}
>
  <GridCanvas2D
    draggables={[draggablePoint[0]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <ExplicitFunction2D func={Integrand} color={PrimeColor.raspberry} width={0.06} />
  </GridCanvas2D>

  <GridCanvas2D
    draggables={[draggablePoint[1]]}
    {cameraPosition}
    {cameraZoom}
    labels={{ xLabel: 'x', yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
  >
    <ExplicitFunction2D
      func={(x: number) => Integral(x) + controls[0]}
      color={PrimeColor.darkGreen}
      width={0.06}
    />
    <ExplicitFunction2D
      func={(x: number) =>
        Integral(draggablePoint[0].position.x) +
        Integrand(draggablePoint[0].position.x) * (x - draggablePoint[0].position.x) +
        controls[0]}
      color={PrimeColor.raspberry}
      width={0.06}
      xMin={draggablePoint[0].position.x - 0.5}
      xMax={draggablePoint[0].position.x + 0.5}
    />
  </GridCanvas2D>
</CanvasGrid>
