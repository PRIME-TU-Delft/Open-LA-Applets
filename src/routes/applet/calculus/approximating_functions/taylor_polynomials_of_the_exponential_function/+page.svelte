<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';

  let initialViewBox: ViewBox | undefined;
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
  initialViewBox = new ViewBox(
    new Vector2(-5.5, -2), // bottom-left
    new Vector2(2.5, 4), // top-right
    0.25 // margin
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
  const func = (x: number) => Math.exp(x);
  function funcT(x: number, n: number, x0: number): number {
    const expx0 = Math.exp(x0);
    let value = 0;
    let factorial = 1;
    for (let k = 0; k <= n; k++) {
      if (k > 0) {
        factorial *= k;
      }
      value += (1 / factorial) * expx0 * Math.pow(x - x0, k);
    }
    return value;
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment(func, PrimeColor.blue, {
      legendText: 'f(x)=e^x',
      width: 0.16
    })
  ];
  const initX = 0;
  const initY = func(initX);
  function SnapToGrid(position: Vector2): Vector2 {
    const snappedX = Number(position.x.toFixed(1));
    const snappedY = func(snappedX);

    return new Vector2(snappedX, snappedY);
  }
  const draggables = [
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      0.16
    )
  ];

  const controls = Controls.addSlider(3, 3, 9, 1, PrimeColor.pink, {
    label: toLatexText('$n=$'),
    valueFn: (v: number) => toLatexText(v.toFixed(0))
  });

  const LegendTs = $derived.by(() => {
    const x = draggables[0].position.x;
    const n = controls[0];
    const legendT1 = new LegendItem(
      'T_{\\$2}(x) \\text{ around } \\$1',
      PrimeColor.orange + PrimeColor.opacity(0.33),
      'square'
    )
      .addAutoParam(x.toFixed(3).replace(/\.?0+$/, ''), PrimeColor.darkGreen)
      .addAutoParam((n - 2).toFixed(0), PrimeColor.pink);
    const legendT2 = new LegendItem(
      'T_{\\$2}(x) \\text{ around } \\$1',
      PrimeColor.orange + PrimeColor.opacity(0.67),
      'square'
    )
      .addAutoParam(x.toFixed(3).replace(/\.?0+$/, ''), PrimeColor.darkGreen)
      .addAutoParam((n - 1).toFixed(0), PrimeColor.pink);
    const legendT3 = new LegendItem(
      'T_{\\$2}(x) \\text{ around } \\$1',
      PrimeColor.orange,
      'square'
    )
      .addAutoParam(x.toFixed(3).replace(/\.?0+$/, ''), PrimeColor.darkGreen)
      .addAutoParam(n.toFixed(0), PrimeColor.pink);
    return [legendT1, legendT2, legendT3];
  });
</script>

<Canvas2D
  {controls}
  {draggables}
  {initialViewBox}
  legendItems={[...getLegend(appletObjects), ...LegendTs]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  <TemplateComponent objects={appletObjects} />
  {@const x0 = draggables[0].position.x}
  {@const n = controls[0]}
  <ExplicitFunction2D
    func={(x: number) => funcT(x, n - 2, x0)}
    color={PrimeColor.orange + PrimeColor.opacity(0.33)}
    width={0.06}
    isDashed={true}
  />
  <ExplicitFunction2D
    func={(x: number) => funcT(x, n - 1, x0)}
    color={PrimeColor.orange + PrimeColor.opacity(0.67)}
    width={0.08}
    isDashed={true}
  />
  <ExplicitFunction2D func={(x: number) => funcT(x, n, x0)} color={PrimeColor.orange} width={0.1} />
</Canvas2D>
