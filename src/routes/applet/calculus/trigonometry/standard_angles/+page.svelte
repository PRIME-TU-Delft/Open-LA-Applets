<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, Circle, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

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
    new Vector2(-7, -5.5), // bottom-left
    new Vector2(7, 5.5), // top-right
    0 // margin
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
  xAxisLabel = '\\cos(\\theta)';
  yAxisLabel = '\\sin(\\theta)';

  function coordinateToLatex(angle: number): string {
    const eps = 1e-10;

    const known: [number, string][] = [
      [0, '\\left(1,0\\right)'],
      [Math.PI / 6, '\\left(\\frac{\\sqrt3}{2},\\frac12\\right)'],
      [Math.PI / 4, '\\left(\\frac{\\sqrt2}{2},\\frac{\\sqrt2}{2}\\right)'],
      [Math.PI / 3, '\\left(\\frac12,\\frac{\\sqrt3}{2}\\right)'],
      [Math.PI / 2, '\\left(0,1\\right)'],
      [(2 * Math.PI) / 3, '\\left(-\\frac12,\\frac{\\sqrt3}{2}\\right)'],
      [(3 * Math.PI) / 4, '\\left(-\\frac{\\sqrt2}{2},\\frac{\\sqrt2}{2}\\right)'],
      [(5 * Math.PI) / 6, '\\left(-\\frac{\\sqrt3}{2},\\frac12\\right)'],
      [Math.PI, '\\left(-1,0\\right)'],
      [(7 * Math.PI) / 6, '\\left(-\\frac{\\sqrt3}{2},-\\frac12\\right)'],
      [(5 * Math.PI) / 4, '\\left(-\\frac{\\sqrt2}{2},-\\frac{\\sqrt2}{2}\\right)'],
      [(4 * Math.PI) / 3, '\\left(-\\frac12,-\\frac{\\sqrt3}{2}\\right)'],
      [(3 * Math.PI) / 2, '\\left(0,-1\\right)'],
      [(5 * Math.PI) / 3, '\\left(\\frac12,-\\frac{\\sqrt3}{2}\\right)'],
      [(7 * Math.PI) / 4, '\\left(\\frac{\\sqrt2}{2},-\\frac{\\sqrt2}{2}\\right)'],
      [(11 * Math.PI) / 6, '\\left(\\frac{\\sqrt3}{2},-\\frac12\\right)']
    ];

    for (const [a, latex] of known) {
      if (Math.abs(angle - a) < eps) {
        return latex;
      }
    }

    const a = angleToLatex(angle);
    return `\\left(\\cos\\left(${a}\\right),\\sin\\left(${a}\\right)\\right)`;
  }

  function angleToDegree(angle: number): string {
    return ((angle / Math.PI) * 180).toFixed(0) + '^\\circ';
  }

  function angleToLatex(angle: number, maxDenominator = 1000): string {
    const r = angle / Math.PI;

    const [p, q] = rationalApproximation(r, maxDenominator);

    if (q === 1) {
      if (p === 0) return '0';
      if (p === 1) return '\\pi';
      if (p === -1) return '-\\pi';
      return `${p}\\pi`;
    }

    const numerator = Math.abs(p) === 1 ? '\\pi' : `${Math.abs(p)}\\pi`;

    const frac = `\\frac{${numerator}}{${q}}`;

    return p < 0 ? `-${frac}` : frac;
  }

  function rationalApproximation(x: number, maxDenominator: number): [number, number] {
    let h1 = 1,
      h0 = 0;
    let k1 = 0,
      k0 = 1;
    let y = x;

    while (true) {
      const a = Math.floor(y);

      const h2 = a * h1 + h0;
      const k2 = a * k1 + k0;

      if (k2 > maxDenominator) {
        return [h1, k1];
      }

      h0 = h1;
      h1 = h2;
      k0 = k1;
      k1 = k2;

      const f = y - a;
      if (Math.abs(f) < 1e-12) {
        return [h1, k1];
      }

      y = 1 / f;
    }
  }

  // ##############
  // APPLET OBJECTS
  // ##############
  const blackAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const orangeAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  const greenAngles = [
    Math.PI / 6,
    Math.PI / 3,
    (2 * Math.PI) / 3,
    (5 * Math.PI) / 6,
    (7 * Math.PI) / 6,
    (4 * Math.PI) / 3,
    (5 * Math.PI) / 3,
    (11 * Math.PI) / 6
  ];
  const appletObjects: AppletObject[] = [
    new Circle(new Vector2(0, 0), 3, PrimeColor.black, {
      width: 0.06,
      radiiShown: blackAngles
    }),
    new Circle(new Vector2(0, 0), 3, PrimeColor.orange, {
      width: 0.06,
      radiiShown: orangeAngles
    }),
    new Circle(new Vector2(0, 0), 3, PrimeColor.darkGreen, {
      width: 0.06,
      radiiShown: greenAngles
    }),
    new Circle(new Vector2(0, 0), 3, PrimeColor.blue, {
      width: 0.08
    })
  ];
  for (const angle of blackAngles) {
    appletObjects.push(
      new Point(new Vector2(3 * Math.cos(angle), 3 * Math.sin(angle)), PrimeColor.black, {
        radius: 0.12
      })
    );
  }
  for (const angle of orangeAngles) {
    appletObjects.push(
      new Point(new Vector2(3 * Math.cos(angle), 3 * Math.sin(angle)), PrimeColor.orange, {
        radius: 0.12
      })
    );
  }
  for (const angle of greenAngles) {
    appletObjects.push(
      new Point(new Vector2(3 * Math.cos(angle), 3 * Math.sin(angle)), PrimeColor.darkGreen, {
        radius: 0.12
      })
    );
  }
</script>

<Canvas2D {initialViewBox} {axis} {scaleX} {scaleY}>
  <TemplateComponent objects={appletObjects} />
  <Latex2D
    latex={xAxisLabel}
    alignX="center"
    alignY="center"
    position={new Vector2(6, 0)}
    background={PrimeColor.white}
  />
  <Latex2D
    latex={yAxisLabel}
    alignX="center"
    alignY="center"
    position={new Vector2(0, 4.5)}
    background={PrimeColor.white}
  />
  <Latex2D
    latex="(1,0)"
    alignX="left"
    alignY="center"
    extend={0.15}
    position={new Vector2(3, 0)}
    background={PrimeColor.white}
  />
  <Latex2D
    latex="(-1,0)"
    alignX="right"
    alignY="center"
    extend={0.15}
    position={new Vector2(-3, 0)}
    background={PrimeColor.white}
  />
  <Latex2D
    latex="(0,1)"
    alignX="center"
    alignY="bottom"
    extend={0.15}
    position={new Vector2(0, 3)}
    background={PrimeColor.white}
  />
  <Latex2D
    latex="(0,-1)"
    alignX="center"
    alignY="top"
    extend={0.15}
    position={new Vector2(0, -3)}
    background={PrimeColor.white}
  />
  {#each blackAngles as angle, i (i)}
    <Latex2D
      latex={angleToLatex(angle)}
      alignX="center"
      alignY="center"
      position={new Vector2(2.5 * Math.cos(angle), 2.5 * Math.sin(angle))}
      background={PrimeColor.white}
      fontSize={Math.abs(Math.cos(angle)).toFixed(0) === '0' ? 0.75 : 1}
    />
    <Latex2D
      latex={angleToDegree(angle)}
      alignX="center"
      alignY="center"
      position={new Vector2(1.75 * Math.cos(angle), 1.75 * Math.sin(angle))}
      background={PrimeColor.white}
      fontSize={0.75}
    />
  {/each}
  {#each orangeAngles as angle, i (i)}
    <Latex2D
      latex={angleToLatex(angle)}
      alignX="center"
      alignY="center"
      position={new Vector2(2.5 * Math.cos(angle), 2.5 * Math.sin(angle))}
      background={PrimeColor.white}
      color={PrimeColor.orange}
      rotation={Math.cos(angle) > 0 ? (angle / Math.PI) * 180 : (angle / Math.PI) * 180 - 180}
      fontSize={0.75}
    />
    <Latex2D
      latex={angleToDegree(angle)}
      alignX="center"
      alignY="center"
      position={new Vector2(1.75 * Math.cos(angle), 1.75 * Math.sin(angle))}
      background={PrimeColor.white}
      color={PrimeColor.orange}
      rotation={Math.cos(angle) > 0 ? (angle / Math.PI) * 180 : (angle / Math.PI) * 180 - 180}
      fontSize={0.75}
    />
    <Latex2D
      latex={coordinateToLatex(angle)}
      alignX={Math.cos(angle) > 0 ? 'left' : 'right'}
      alignY="center"
      position={new Vector2(3.25 * Math.cos(angle), 3.25 * Math.sin(angle))}
      background={PrimeColor.white}
      color={PrimeColor.orange}
      rotation={Math.cos(angle) > 0 ? (angle / Math.PI) * 180 : (angle / Math.PI) * 180 - 180}
      fontSize={0.75}
    />
  {/each}
  {#each greenAngles as angle, i (i)}
    <Latex2D
      latex={angleToLatex(angle)}
      alignX="center"
      alignY="center"
      position={new Vector2(2.5 * Math.cos(angle), 2.5 * Math.sin(angle))}
      background={PrimeColor.white}
      color={PrimeColor.darkGreen}
      rotation={Math.cos(angle) > 0 ? (angle / Math.PI) * 180 : (angle / Math.PI) * 180 - 180}
      fontSize={0.75}
    />
    <Latex2D
      latex={angleToDegree(angle)}
      alignX="center"
      alignY="center"
      position={new Vector2(1.75 * Math.cos(angle), 1.75 * Math.sin(angle))}
      background={PrimeColor.white}
      color={PrimeColor.darkGreen}
      rotation={Math.cos(angle) > 0 ? (angle / Math.PI) * 180 : (angle / Math.PI) * 180 - 180}
      fontSize={0.75}
    />
    <Latex2D
      latex={coordinateToLatex(angle)}
      alignX={Math.cos(angle) > 0 ? 'left' : 'right'}
      alignY="center"
      position={new Vector2(3.25 * Math.cos(angle), 3.25 * Math.sin(angle))}
      background={PrimeColor.white}
      color={PrimeColor.darkGreen}
      rotation={Math.cos(angle) > 0 ? (angle / Math.PI) * 180 : (angle / Math.PI) * 180 - 180}
      fontSize={0.75}
    />
  {/each}
</Canvas2D>
