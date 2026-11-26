<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    ParameterizedFunctionFragment,
    Point,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';

  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

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
    skipX: -1,
    skipY: -1,
    showAxisX: false,
    showAxisY: false,
    showGridLinesX: false,
    showGridLinesY: false
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
  xAxisLabel = '';
  yAxisLabel = '';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(6, 1, 20, 1, PrimeColor.orange, {
    label: toLatexText('$N=$'),
    valueFn: (v: number) => toLatexText(v.toFixed(0))
  });
  const N = $derived(controls[0]);

  // Create the fibonacci numbers and squares
  function fibonacci(n: number): number[] {
    if (n <= 0) return [];

    const fib = [1];
    if (n === 1) return fib;

    fib.push(1);

    for (let i = 2; i < n; i++) {
      fib.push(fib[i - 1] + fib[i - 2]);
    }

    return fib;
  }

  function fibonacciSquares(n: number): Vector2[][] {
    if (n <= 0) return [];

    const fib = fibonacci(n);

    const squares: Vector2[][] = [
      [
        new Vector2(0, 0),
        new Vector2(fib[0], 0),
        new Vector2(fib[0], fib[0]),
        new Vector2(0, fib[0])
      ]
    ];

    if (n === 1) return squares;

    squares.push([
      new Vector2(fib[0], 0), // lower left
      new Vector2(fib[0] + fib[1], 0),
      new Vector2(fib[0] + fib[1], fib[1]),
      new Vector2(fib[0], fib[1])
    ]);

    let minX = 0;
    let maxX = fib[0] + fib[1];
    let minY = 0;
    let maxY = fib[0];

    const directions = ['up', 'left', 'down', 'right'];

    for (let i = 2; i < n; i++) {
      const size = fib[i];
      const dir = directions[(i - 2) % 4];

      let square: Vector2[] = [];
      let x: number;
      let y: number;

      switch (dir) {
        case 'up':
          x = minX;
          y = maxY;
          square = [
            new Vector2(x, y),
            new Vector2(x + size, y),
            new Vector2(x + size, y + size),
            new Vector2(x, y + size)
          ];
          maxY += size;
          break;

        case 'left':
          x = minX - size;
          ((y = minY), size);
          square = [
            new Vector2(x, y),
            new Vector2(x + size, y),
            new Vector2(x + size, y + size),
            new Vector2(x, y + size)
          ];
          minX -= size;
          break;

        case 'down':
          x = minX;
          y = minY - size;
          square = [
            new Vector2(x, y),
            new Vector2(x + size, y),
            new Vector2(x + size, y + size),
            new Vector2(x, y + size)
          ];
          minY -= size;
          break;

        case 'right':
          x = maxX;
          y = minY;
          square = [
            new Vector2(x, y),
            new Vector2(x + size, y),
            new Vector2(x + size, y + size),
            new Vector2(x, y + size)
          ];
          maxX += size;
          break;
      }

      squares.push(square);
    }

    return squares;
  }
  const Squares = $derived(fibonacciSquares(N));

  const scaleWidths = $derived.by(() => {
    let minX = -1;
    let maxX = 1;
    let minY = -1;
    let maxY = 1;
    Squares.forEach((square) => {
      square.forEach((point) => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });
    const diffX = maxX - minX;
    const diffY = maxY - minY;
    return Math.max(diffX / 13, diffY / 8);
  });

  const { Corners, Origins, Centers } = $derived.by(() => {
    let Corners = [new Vector2(0, 1)];
    let Origins: Vector2[] = [];
    let Centers: Vector2[] = [];
    let lastCorner = Corners[0];
    // loop over each of the squares, and find the corner furthest
    // from the last point in Corners.
    Squares.forEach((square) => {
      let dists: number[] = [];
      square.forEach((point) => {
        const dist = point.distanceTo(lastCorner);
        dists.push(dist);
      });
      const maxIndex = dists.indexOf(Math.max(...dists));
      // Calculate the origin of the arc of this square
      const Center = lastCorner.clone().add(square[maxIndex]).multiplyScalar(0.5);
      const Direction = Center.clone()
        .sub(square[maxIndex])
        .rotateAround(new Vector2(0, 0), -Math.PI / 2);
      const Origin = Center.clone().add(Direction);
      // Add and update
      Origins.push(Origin);
      lastCorner = square[maxIndex];
      Corners.push(lastCorner);
      Centers.push(Center);
    });
    return { Corners, Origins, Centers };
  });

  const fibNumbers = $derived(fibonacci(N));
  const appletObjects: AppletObject[] = $derived.by(() => {
    const appletObjects: AppletObject[] = [];
    Squares.forEach((Square) => {
      appletObjects.push(
        new Polygon(Square, PrimeColor.blue, { fillStyle: 'none', width: 2 * scaleWidths })
      );
      appletObjects.push(
        new Polygon(Square, PrimeColor.blue + PrimeColor.opacity(0.15), {
          fillStyle: 'full',
          width: 1 * scaleWidths
        })
      );
    });
    Origins.forEach((point, ip) => {
      const diff1 = Corners[ip].clone().sub(point);
      const angle1 = Number((Math.atan2(diff1.y, diff1.x) / Math.PI).toFixed(1)) * Math.PI;
      const angle2 = angle1 + 0.5 * Math.PI;
      appletObjects.push(
        new ParameterizedFunctionFragment(
          (t) => point.x + fibNumbers[ip] * Math.cos(t),
          (t) => point.y + fibNumbers[ip] * Math.sin(t),
          PrimeColor.black,
          { tStart: angle1, tEnd: angle2, width: 0.12 * scaleWidths }
        )
      );
    });
    Centers.forEach((point, pi) => {
      appletObjects.push(
        new Text(
          fibNumbers[pi].toFixed(0),
          point,
          PrimeColor.black,
          { alignX: 'center', alignY: 'center' },
          0.5 * fibNumbers[pi]
        )
      );
    });
    return appletObjects;
  });

  // (remove if unnecessary)
  let initialViewBox = $derived.by(() => {
    let minX = -1;
    let maxX = 1;
    let minY = -1;
    let maxY = 1;
    Squares.forEach((square) => {
      square.forEach((point) => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });
    const diffX = Math.max(Math.abs(maxX - 0.5), Math.abs(minX - 0.5));
    const diffY = Math.max(Math.abs(maxY - 0.5), Math.abs(minY - 0.5));
    const extraX = 0.3 * diffX;
    const extraY = 0.3 * diffY;
    const extra = Math.max(extraX, extraY);
    return new ViewBox(
      new Vector2(0.5 - diffX - extra, 0.5 - diffY - 2 * extra), // bottom-left
      new Vector2(0.5 + diffX + extra, 0.5 + diffY + extra), // top-right
      0 // margin
    );
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
>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
