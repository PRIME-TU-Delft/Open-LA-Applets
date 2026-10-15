<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { parse, compile } from '@cortex-js/compute-engine';
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
    new Vector2(-1, -1), // bottom-left
    new Vector2(5, 1.5), // top-right
    0 // margin
  );

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
  let scaleY = 5;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(-2, -3, -1, 0.05, PrimeColor.pink, {
    label: toLatexText('$b=$'),
    valueFn: (v: number) => toLatexText('$-\\sqrt{' + (-v).toFixed(2) + '}$')
  });
  const b = $derived(-Math.sqrt(-controls[0]));
  const c = $derived(0.25 * b ** 2);

  const LatexFunc = 'e^{-x^2}';
  const parsed = parse(LatexFunc);
  const compiled = compile(parsed);
  const CompFunc = (x: number) => {
    const result = compiled.run?.({ x });
    return typeof result === 'number' ? result : Number(result);
  };
  const LatexFunc2 = $derived('e^{bx+\\frac14b^2}');
  const LatexFunc2c = $derived('e^{' + b + 'x+' + c + '}');
  const parsed2 = $derived(parse(LatexFunc2c));
  const compiled2 = $derived(compile(parsed2));
  const CompFunc2 = $derived((x: number) => {
    const result = compiled2.run?.({ x });
    return typeof result === 'number' ? result : Number(result);
  });

  const D = $derived(b ** 2 - 4 * c);
  const x1 = $derived((-b + Math.sqrt(D)) / 2);

  const appletObjects: AppletObject[] = $derived.by(() => {
    let duh: AppletObject[] = [
      new FunctionFragment(LatexFunc2c, PrimeColor.orange, {
        domain: { xMin: 0, xMax: 30 / scaleX },
        legendText: LatexFunc2,
        width: 0.08,
        integral: {
          xLeft: 0,
          xRight: 30 / scaleX,
          legendText: '\\int_{0}^{\\infty}' + LatexFunc2 + '\\,dx',
          color: PrimeColor.yellow,
          shape: 'square',
          isDashed: false
        }
      }).addIncludedPoints(new Vector2(0, CompFunc2(0)), undefined, 0.12),
      new FunctionFragment(LatexFunc, PrimeColor.blue, {
        domain: { xMin: 0, xMax: 30 / scaleX },
        legendText: LatexFunc,
        width: 0.08,
        integral: {
          xLeft: 0,
          xRight: 30 / scaleX,
          legendText: '\\int_{0}^{\\infty}' + LatexFunc + '\\,dx',
          color: PrimeColor.darkGreen,
          shape: 'square'
        }
      }).addIncludedPoints(new Vector2(0, CompFunc(0)), undefined, 0.12)
    ];
    if (D >= 0) {
      duh.push(new Point(new Vector2(x1, CompFunc2(x1)), PrimeColor.black));
    }
    return duh;
  });
</script>

<Canvas2D
  {initialViewBox}
  legendItems={[...getLegend([appletObjects[1]]), ...getLegend([appletObjects[0]])]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  {controls}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
