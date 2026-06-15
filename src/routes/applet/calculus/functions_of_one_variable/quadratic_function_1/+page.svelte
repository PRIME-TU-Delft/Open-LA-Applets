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
  import Point2D from '$lib/d3/Point2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import { toLatexText } from '$lib/utils/FormatString';

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
    new Vector2(-1, -4), // bottom-left
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
  const controls = Controls.addSlider(1, -5, 5, 0.1, PrimeColor.darkGreen, {
    label: toLatexText('$a$'),
    valueFn: (v: number) => v.toFixed(1)
  }) // a
    .addSlider(-4, -5, 5, 0.1, PrimeColor.orange, {
      label: toLatexText('$b$'),
      valueFn: (v: number) => v.toFixed(1)
    }) // b
    .addSlider(3, -5, 5, 0.1, PrimeColor.raspberry, {
      label: toLatexText('$c$'),
      valueFn: (v: number) => v.toFixed(1)
    }); // c
  function func(x: number) {
    const a = controls[0];
    const b = controls[1];
    const c = controls[2];
    return a * x * x + b * x + c;
  }
  const appletObjects: AppletObject[] = [new FunctionFragment(func, PrimeColor.blue)];

  function textFormula() {
    const a = controls[0];
    const b = controls[1];
    const c = controls[2];
    let value = 'h(x) = ';
    if (a === 0 && b === 0 && c === 0) {
      value += 0;
      return value;
    }
    if (a !== 0) {
      if (a !== 1 && a !== -1) {
        let astr = a.toFixed(1);
        if (astr.endsWith('.0')) {
          astr = astr.slice(0, -2);
        }
        value += astr;
      } else if (a === -1) {
        value += '-';
      } else if (a === 1) {
        value += '';
      }
      value += 'x^2';
    }
    if (b !== 0) {
      if (b > 0) {
        value += '+';
      }
      if (b !== 1 && b !== -1) {
        let bstr = b.toFixed(1);
        if (bstr.endsWith('.0')) {
          bstr = bstr.slice(0, -2);
        }
        value += bstr;
      } else if (b === -1) {
        value += '-';
      } else if (b === 1) {
        value += '';
      }
      value += 'x';
    }
    if (c !== 0) {
      if (c > 0) {
        value += '+';
      }
      let cstr = c.toFixed(1);
      if (cstr.endsWith('.0')) {
        cstr = cstr.slice(0, -2);
      }
      value += cstr;
    }
    return value;
  }

  const legendItems = $derived([new LegendItem(textFormula(), PrimeColor.blue)]);

  function points() {
    // Returns y-intercept, then global max/min, then local max/min (if they exist)
    const a = controls[0];
    const b = controls[1];
    const c = controls[2];

    let list = [new Vector2(0, c)]; // y-intercept

    if (a !== 0 && b !== 0) {
      const xVertex = -b / (2 * a);
      const yVertex = func(xVertex);
      list.push(new Vector2(xVertex, yVertex));
    } else {
      list.push(new Vector2(-100, -100)); // placeholder point that won't be shown
    }

    const D = b * b - 4 * a * c;
    if (D > 0) {
      const sqrtD = Math.sqrt(D);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      list.push(new Vector2(x1, func(x1)), new Vector2(x2, func(x2)));
    }
    return list;
  }
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <Point2D position={points()[0]} color={PrimeColor.raspberry} shape="circle" />
  {#if points().length > 1}
    <Point2D position={points()[1]} color={PrimeColor.darkGreen} shape="triangle" />
  {/if}
  {#if points().length > 2}
    <Point2D position={points()[2]} color={PrimeColor.orange} shape="square" />
    <Point2D position={points()[3]} color={PrimeColor.orange} shape="square" />
  {/if}
</Canvas2D>
