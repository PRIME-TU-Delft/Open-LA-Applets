<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    FunctionFragment,
    LineFragment,
    Point
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  function gamma(z: number): number {
    const p = [
      676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406,
      12.507343278686905, -0.13857109526572012, 9.984369578019571e-6, 1.5056327351493116e-7
    ];

    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }

    z--;

    let x = 0.9999999999998099;
    for (let i = 0; i < p.length; i++) {
      x += p[i] / (z + i + 1);
    }

    const t = z + p.length - 0.5;

    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }

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
    new Vector2(-1.5, -1.5), // bottom-left
    new Vector2(10.5, 6.5), // top-right
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
    logarithmicY: true,
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

  const controls = Controls.addToggle(false, toLatexText('Original'), PrimeColor.black, {
    isSwitch: true,
    switchRightSide: toLatexText('Shifted left')
  });

  const shift = $derived(controls[0] ? 1 : 0);
  const LatexFunc = $derived(controls[0] ? '\\Gamma(x+1)' : '\\Gamma(x)');
  const CompFunc = $derived((x: number) => {
    if (axis.logarithmicY) {
      return Math.log10(gamma(x + shift));
    } else {
      return gamma(x + shift);
    }
  });
  const appletObjects: AppletObject[] = $derived.by(() => {
    const data: AppletObject[] = [
      new FunctionFragment(CompFunc, PrimeColor.blue, {
        domain: { xMin: -shift, xMax: 30 / scaleX },
        legendText: LatexFunc,
        width: 0.08,
        stepSize: 0.001
      }),
      new LineFragment(new Vector2(-shift, 3), new Vector2(-shift, 30), PrimeColor.blue, {
        width: 0.08
      })
    ];
    let prod = 1;
    for (let n = 0; n <= 30; n++) {
      if (n > 0) {
        prod = prod * n;
      }
      let location = new Vector2(n, prod);
      if (axis.logarithmicY) {
        location.y = Math.log10(prod);
      }
      if (n === 0) {
        data.push(
          new Point(location, PrimeColor.orange, { shape: 'circle', legendText: '(n,n!)' })
        );
      } else {
        data.push(new Point(location, PrimeColor.orange, { shape: 'circle' }));
      }
    }
    return data;
  });
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-center"
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
