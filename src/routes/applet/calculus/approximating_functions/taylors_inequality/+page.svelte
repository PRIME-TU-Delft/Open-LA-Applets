<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Polygon } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { LegendItem, FillType } from '$lib/utils/Legend';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import FillBetweenFunctions2D from '$lib/d3/FillBetweenFunctions2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Polygon2D from '$lib/d3/Polygon2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';

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
    new Vector2(-12.5, -8), // bottom-left
    new Vector2(10.5, 8), // top-right
    0.25 // margin
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
  const func = (x: number) => Math.cos(x) + Math.sin(x);
  const func1 = (x: number) => -Math.sin(x) + Math.cos(x);
  const func2 = (x: number) => -Math.cos(x) - Math.sin(x);
  const func3 = (x: number) => Math.sin(x) - Math.cos(x);
  function funcT(x: number, n: number, x0: number): number {
    const fvals = [func(x0), func1(x0), func2(x0), func3(x0)];
    let value = 0;
    let factorial = 1;
    for (let k = 0; k <= n; k++) {
      if (k > 0) {
        factorial *= k;
      }
      const kmod = ((k % 4) + 4) % 4;

      value += (1 / factorial) * fvals[kmod] * Math.pow(x - x0, k);
    }
    return value;
  }
  function funcE(x: number, n: number, x0: number): number {
    const M = WorldtoM(draggables[3].position.y);
    let factorial = 1;
    for (let k = 0; k <= n + 1; k++) {
      if (k > 0) {
        factorial *= k;
      }
    }
    const errorBound = (M / factorial) * Math.pow(Math.abs(x - x0), n + 1);
    return errorBound;
  }
  const MWidth = 2;
  const MStart = 6;
  const MHalveHeight = 7;
  const appletObjects: AppletObject[] = [
    new FunctionFragment(func, PrimeColor.blue, {
      legendText: 'f(x)=\\cos(x)+\\sin(x)',
      width: 0.16,
      domain: { xMin: -15, xMax: 15 }
    }),
    new Polygon(
      [
        new Vector2(MStart, -MHalveHeight),
        new Vector2(MStart, MHalveHeight),
        new Vector2(MStart + MWidth, MHalveHeight),
        new Vector2(MStart + MWidth, -MHalveHeight)
      ],
      PrimeColor.white + PrimeColor.opacity(0.9),
      { fillStyle: 'full' }
    ),
    new Polygon(
      [
        new Vector2(MStart, -MHalveHeight),
        new Vector2(MStart, MHalveHeight),
        new Vector2(MStart + MWidth, MHalveHeight),
        new Vector2(MStart + MWidth, -MHalveHeight)
      ],
      PrimeColor.black,
      { fillStyle: 'none' }
    )
  ];
  const initX = 0;
  const initP = initX - Math.PI;
  const initQ = initX + Math.PI;
  const initY = func(initX);
  function SnapToGrid(position: Vector2): Vector2 {
    // snap to decimal multiples of Pi
    let minSnappedX = draggables[1].position.x;
    minSnappedX = minSnappedX / Math.PI;
    minSnappedX = Math.ceil(minSnappedX * 10) / 10 + 0.1;
    let maxSnappedX = draggables[2].position.x;
    maxSnappedX = maxSnappedX / Math.PI;
    maxSnappedX = Math.floor(maxSnappedX * 10) / 10 - 0.1;
    let snappedX = position.x;
    snappedX = snappedX / Math.PI;
    snappedX = Number(snappedX.toFixed(1));
    snappedX = Math.min(snappedX, maxSnappedX);
    snappedX = Math.max(snappedX, minSnappedX);
    snappedX = snappedX * Math.PI;
    const snappedY = func(snappedX);

    return new Vector2(snappedX, snappedY);
  }
  function SnapToGridP(position: Vector2): Vector2 {
    // snap to decimal multiples of Pi
    let maxSnappedX = draggables[0].position.x;
    maxSnappedX = maxSnappedX / Math.PI;
    maxSnappedX = Math.floor(maxSnappedX * 10) / 10 - 0.1;
    let snappedX = position.x;
    snappedX = snappedX / Math.PI;
    snappedX = Number(snappedX.toFixed(1));
    snappedX = Math.min(maxSnappedX, snappedX);
    snappedX = snappedX * Math.PI;
    const snappedY = 0;
    return new Vector2(snappedX, snappedY);
  }
  function SnapToGridQ(position: Vector2): Vector2 {
    // snap to decimal multiples of Pi
    let maxSnappedX = draggables[0].position.x;
    maxSnappedX = maxSnappedX / Math.PI;
    maxSnappedX = Math.ceil(maxSnappedX * 10) / 10 + 0.1;
    let snappedX = position.x;
    snappedX = snappedX / Math.PI;
    snappedX = Number(snappedX.toFixed(1));
    snappedX = Math.max(maxSnappedX, snappedX);
    snappedX = snappedX * Math.PI;
    const snappedY = 0;
    return new Vector2(snappedX, snappedY);
  }
  function SnapToGridM(position: Vector2): Vector2 {
    const snappedX = MStart + (2 * MWidth) / 3;
    const y = position.y;
    let snappedM = WorldtoM(y);
    snappedM = Number(snappedM.toFixed(3));
    snappedM = Math.max(snappedM, 0.001);
    snappedM = Math.min(snappedM, 2);
    const snappedY = MtoWorld(snappedM);
    return new Vector2(snappedX, snappedY);
  }
  const kMin = Math.ceil((-15 - Math.PI / 4) / Math.PI);
  const kMax = Math.floor((15 - Math.PI / 4) / Math.PI);
  const Xs = Array.from({ length: kMax - kMin + 1 }, (_, i) => Math.PI / 4 + (kMin + i) * Math.PI);

  const negXs = Xs.map((x) => -x);
  function CalculateMinM(p: number, q: number, n: number): number {
    // Calculate the true minimum value for M
    // Depends on n, p and q.
    // n+1 determines where the local maxima are located
    // p and q determine the side values ánd whether local maxima should be considered

    // Determine the list to pick
    let pickedXs = Xs;
    if (n % 2 === 0) {
      pickedXs = negXs;
    }
    const hasBetween = pickedXs.some((x) => x > p && x < q);
    if (hasBetween) {
      // so local maximum present
      return Math.sqrt(2);
    } else {
      // so only bounds matter
      const fvalsP = [func(p), func1(p), func2(p), func3(p)];
      const fvalsQ = [func(q), func1(q), func2(q), func3(q)];
      const nplus1mod = (((n + 1) % 4) + 4) % 4;
      const fvalP = Math.abs(fvalsP[nplus1mod]);
      const fvalQ = Math.abs(fvalsQ[nplus1mod]);
      return Math.max(fvalP, fvalQ);
    }
  }
  const draggables = [
    // center of taylor polynomial, x0
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      0.2
    ),
    // left side of interval, p
    new Draggable(
      new Vector2(initP, 0),
      PrimeColor.cyan,
      undefined,
      SnapToGridP,
      undefined,
      undefined,
      0.2,
      'square'
    ),
    // right side of interval, q
    new Draggable(
      new Vector2(initQ, 0),
      PrimeColor.red,
      undefined,
      SnapToGridQ,
      undefined,
      undefined,
      0.2,
      'square'
    ),
    new Draggable(
      new Vector2(MStart + (2 * MWidth) / 3, MtoWorld(2)),
      PrimeColor.yellow,
      undefined,
      SnapToGridM,
      undefined,
      undefined,
      0.5,
      'square'
    )
  ];
  function MtoWorld(M: number): number {
    return (M / 2) * (2 * MHalveHeight - 2 * MWidth) - (MHalveHeight - MWidth);
  }
  function WorldtoM(W: number): number {
    return 1 + W / (MHalveHeight - MWidth);
  }

  const controls = Controls.addSlider(1, 1, 9, 1, PrimeColor.pink, {
    label: toLatexText('$n=$'),
    valueFn: (v: number) => v.toFixed(0)
  });

  const Legends = $derived.by(() => {
    let x = draggables[0].position.x;
    x = x / Math.PI;
    let stringX = '';
    if (x === 0) {
      stringX += '0';
    } else if (x === 1) {
      stringX += '\\pi';
    } else if (x === -1) {
      stringX += '-\\pi';
    } else {
      stringX += x.toFixed(1).replace(/\.?0+$/, '');
      stringX += '\\pi';
    }
    const M = WorldtoM(draggables[3].position.y);
    const n = controls[0];
    const legendTn = new LegendItem(
      'T_{\\$2}(x) \\text{ around } \\$1',
      PrimeColor.orange,
      'square'
    )
      .addAutoParam(stringX, PrimeColor.darkGreen)
      .addAutoParam(n.toFixed(0), PrimeColor.pink);
    const legendPlusMinus = new LegendItem(
      'T_{\\$2}(x)\\pm \\$4\\frac{\\left|x-\\left(\\$1\\right)\\right|^{\\$3}}{\\$3!}',
      PrimeColor.purple,
      'triangle',
      FillType.Dashed
    )
      .addAutoParam(stringX, PrimeColor.darkGreen)
      .addAutoParam(n.toFixed(0), PrimeColor.pink)
      .addAutoParam((n + 1).toFixed(0), PrimeColor.pink)
      .addAutoParam(M.toFixed(3).replace(/\.?0+$/, ''), PrimeColor.yellow);
    return [legendTn, legendPlusMinus];
  });

  // Vertical Coordinates for M ticks, resemble starting at 0 and ending at 2
  const Mcount = 21;
  const DM = 2 / (Mcount - 1);
  let Mlist = [];
  let MListTransformed = [];
  for (let k = 0; k < 21; k++) {
    const newM = k * DM;
    Mlist.push(newM);
    MListTransformed.push(MtoWorld(newM));
  }
  console.log(Mlist);

  const formulas = $derived.by(() => {
    let p = draggables[1].position.x;
    p = p / Math.PI;
    p = Number(p.toFixed(1));
    let stringP = '';
    if (p === 0) {
      stringP += '0';
    } else if (p === 1) {
      stringP += '\\pi';
    } else if (p === -1) {
      stringP += '-\\pi';
    } else {
      stringP += p.toFixed(1).replace(/\.?0+$/, '');
      stringP += '\\pi';
    }
    let q = draggables[2].position.x;
    q = q / Math.PI;
    q = Number(q.toFixed(1));
    let stringQ = '';
    if (q === 0) {
      stringQ += '0';
    } else if (q === 1) {
      stringQ += '\\pi';
    } else if (q === -1) {
      stringQ += '-\\pi';
    } else {
      stringQ += q.toFixed(1).replace(/\.?0+$/, '');
      stringQ += '\\pi';
    }
    const M = WorldtoM(draggables[3].position.y);
    const formulaD = new Formula('D &= [\\$1,\\$2]')
      .addAutoParam(stringP, PrimeColor.cyan)
      .addAutoParam(stringQ, PrimeColor.red);
    const formulaM = new Formula('M &= \\$1').addAutoParam(
      M.toFixed(3).replace(/\.?0+$/, ''),
      PrimeColor.yellow
    );
    return new Formulas(formulaD, formulaM).align();
  });
</script>

<Canvas2D
  {formulas}
  {controls}
  {draggables}
  {initialViewBox}
  legendItems={[...getLegend(appletObjects), ...Legends]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  {@const MinM = CalculateMinM(draggables[1].position.x, draggables[2].position.x, controls[0])}
  {@const currentM = WorldtoM(draggables[3].position.y)}
  <FillBetweenFunctions2D
    func1={(x: number) => funcT(x, n, x0) + funcE(x, n, x0)}
    func2={(x: number) => funcT(x, n, x0) - funcE(x, n, x0)}
    color1={PrimeColor.black}
    color2={PrimeColor.black}
    width={0.05}
    xMin={0}
    xMax={0}
    integral={{
      xLeft: draggables[1].position.x,
      xRight: draggables[2].position.x,
      fillStyle: currentM < MinM ? 'dashed' : 'full',
      color: currentM < MinM ? PrimeColor.raspberry : PrimeColor.green,
      opacity: 0.2
    }}
  />
  <InfiniteLine2D
    origin={draggables[1].position}
    direction={new Vector2(0, 1)}
    isDashed={true}
    width={0.1}
    color={PrimeColor.cyan}
  />
  <InfiniteLine2D
    origin={draggables[2].position}
    direction={new Vector2(0, 1)}
    isDashed={true}
    width={0.1}
    color={PrimeColor.red}
  />
  <ExplicitFunction2D
    func={(x: number) => funcT(x, n, x0) + funcE(x, n, x0)}
    color={PrimeColor.purple}
    width={0.1}
    isDashed={true}
  />
  <ExplicitFunction2D
    func={(x: number) => funcT(x, n, x0) - funcE(x, n, x0)}
    color={PrimeColor.purple}
    width={0.1}
    isDashed={true}
  />
  <TemplateComponent objects={appletObjects} />
  {@const x0 = draggables[0].position.x}
  {@const n = controls[0]}
  <ExplicitFunction2D func={(x: number) => funcT(x, n, x0)} color={PrimeColor.orange} width={0.1} />
  <Vector2D
    color={PrimeColor.black}
    origin={new Vector2(MStart + (2 * MWidth) / 3, -MHalveHeight + MWidth / 2)}
    direction={new Vector2(0, 1)}
    length={2 * MHalveHeight - MWidth}
    radius={0.15}
  />
  <Polygon2D
    points={[
      new Vector2(MStart, MtoWorld(MinM)),
      new Vector2(MStart, -MHalveHeight),
      new Vector2(MStart + MWidth, -MHalveHeight),
      new Vector2(MStart + MWidth, MtoWorld(MinM))
    ]}
    color={PrimeColor.raspberry}
    opacity={1.0}
    fillStyle="dashed"
  />
  <Polygon2D
    points={[
      new Vector2(MStart, MtoWorld(MinM)),
      new Vector2(MStart, MHalveHeight),
      new Vector2(MStart + MWidth, MHalveHeight),
      new Vector2(MStart + MWidth, MtoWorld(MinM))
    ]}
    color={PrimeColor.green}
    opacity={0.2}
  />
  <Polygon2D
    points={[
      new Vector2(MStart, MtoWorld(MinM)),
      new Vector2(MStart, MHalveHeight),
      new Vector2(MStart + MWidth, MHalveHeight),
      new Vector2(MStart + MWidth, MtoWorld(MinM))
    ]}
    color={PrimeColor.green}
    opacity={1.0}
    fillStyle="none"
  />
  <Latex2D
    latex="M"
    position={new Vector2(MStart + (2 * MWidth) / 3, MHalveHeight - MWidth / 2)}
    alignX="center"
    alignY="bottom"
  />
  {#each Mlist as M, i (i)}
    <Line2D
      start={new Vector2(MStart + (2 * MWidth) / 3 - MWidth / 8, MListTransformed[i])}
      end={new Vector2(MStart + (2 * MWidth) / 3 + MWidth / 8, MListTransformed[i])}
    />
    {#if i % 2 === 0}
      <Latex2D
        latex={M.toFixed(1)}
        position={new Vector2(MStart + (2 * MWidth) / 3 - (1.2 * MWidth) / 8, MListTransformed[i])}
        alignX="right"
        alignY="center"
      />
    {/if}
  {/each}
</Canvas2D>
