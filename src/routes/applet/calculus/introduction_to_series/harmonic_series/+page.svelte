<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    Polygon,
    Text,
    FunctionFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { getLegend } from '$lib/template/ObjectFormulas';

  let initialViewBox: ViewBox | undefined;
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
    new Vector2(-1.5, -2.5), // bottom-left
    new Vector2(14.5, 3.5), // top-right
    0 // margin
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
    skipY: 0,
    showAxisX: true,
    showAxisY: true,
    showGridLinesX: true,
    showGridLinesY: true
  };

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(4, 0, 12, 1, PrimeColor.orange, {
    label: toLatexText('$N=$'),
    valueFn: (v: number) => toLatexText(v.toFixed(0)),
    animationStep: 1,
    loop: true,
    playSpeed: 1000
  });
  const N = $derived(controls[0]);

  // Make the squares and rectangles
  const { Rectangles, TopCenters } = $derived.by(() => {
    const Rectangles: Vector2[][] = [];
    const TopCenters: Vector2[] = [];
    for (let n = 1; n <= N; n++) {
      const newPoly: Vector2[] = [
        new Vector2(n, 0),
        new Vector2(n + 1, 0),
        new Vector2(n + 1, 1 / n),
        new Vector2(n, 1 / n)
      ];
      Rectangles.push(newPoly);
      TopCenters.push(new Vector2(n + 0.5, 1 / n));
    }

    return { Rectangles, TopCenters };
  });

  const appletObjects: AppletObject[] = $derived.by(() => {
    const appletObjects: AppletObject[] = [];
    Rectangles.forEach((poly, ip) => {
      if (ip == 0) {
        appletObjects.push(
          new Polygon(poly, PrimeColor.blue, {
            fillStyle: 'full',
            fillColor: PrimeColor.blue + PrimeColor.opacity(0.15),
            width: 1,
            legendText: 's_{N}=\\sum_{n=1}^{N}\\frac{1}{n}'
          })
        );
      } else {
        appletObjects.push(
          new Polygon(poly, PrimeColor.blue, {
            fillStyle: 'full',
            fillColor: PrimeColor.blue + PrimeColor.opacity(0.15),
            width: 1
          })
        );
      }
    });
    TopCenters.forEach((point, pi) => {
      const denom = pi + 1;
      appletObjects.push(
        new Text(
          '\\frac{1}{' + denom.toFixed(0) + '}',
          point.clone().add(new Vector2(0, 0.25)),
          PrimeColor.black,
          { alignX: 'center', alignY: 'bottom' },
          1
        )
      );
    });
    appletObjects.push(
      new FunctionFragment((x) => 1 / x, PrimeColor.darkGreen, {
        width: 0.04,
        legendText: 'f(x)=\\frac{1}{x}',
        domain: { xMin: 0 }
      })
    );
    return appletObjects;
  });
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {axis}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: 'x', yLabel: 'y' }}
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
