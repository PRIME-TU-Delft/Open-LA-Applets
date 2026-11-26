<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, Polygon, Text } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';

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
    new Vector2(0, -3.5), // bottom-left
    new Vector2(8, 9), // top-right
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
    skipX: -1,
    skipY: -1,
    showAxisX: false,
    showAxisY: false,
    showGridLinesX: false,
    showGridLinesY: false
  };

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(8, 1, 20, 1, PrimeColor.orange, {
    label: toLatexText('$N=$'),
    valueFn: (v: number) => toLatexText(v.toFixed(0)),
    animationStep: 0.25 / 3
  });
  const N = $derived(controls[0]);

  // Make the squares and rectangles
  const { SquaresAndRectangles, Centers, Heights } = $derived.by(() => {
    const SquaresAndRectangles: Vector2[][] = [];
    SquaresAndRectangles.push([
      new Vector2(0, 0),
      new Vector2(8, 0),
      new Vector2(8, 8),
      new Vector2(0, 8)
    ]);
    const Centers: Vector2[] = [];
    const Heights: number[] = [];
    for (let n = 1; n <= N; n++) {
      let newPoly: Vector2[] = [];
      let newCenter: Vector2;
      if (n == 1) {
        newPoly = [new Vector2(0, 0), new Vector2(4, 0), new Vector2(4, 8), new Vector2(0, 8)];
      } else if (n % 2 === 0) {
        const oldPoly = SquaresAndRectangles[SquaresAndRectangles.length - 1];
        const width = oldPoly[1].x - oldPoly[0].x;
        newPoly.push(oldPoly[0].clone().add(new Vector2(width, width)));
        newPoly.push(oldPoly[1].clone().add(new Vector2(width, width)));
        newPoly.push(oldPoly[2].clone().add(new Vector2(width, 0)));
        newPoly.push(oldPoly[3].clone().add(new Vector2(width, 0)));
      } else {
        const oldPoly = SquaresAndRectangles[SquaresAndRectangles.length - 1];
        const width = oldPoly[1].x - oldPoly[0].x;
        newPoly.push(oldPoly[0].clone().add(new Vector2(0, -width)));
        newPoly.push(oldPoly[1].clone().add(new Vector2(-width / 2, -width)));
        newPoly.push(oldPoly[2].clone().add(new Vector2(-width / 2, -width)));
        newPoly.push(oldPoly[3].clone().add(new Vector2(0, -width)));
      }
      SquaresAndRectangles.push(newPoly);
      newCenter = newPoly[0]
        .clone()
        .add(newPoly[1])
        .add(newPoly[2])
        .add(newPoly[3])
        .multiplyScalar(0.25);
      Centers.push(newCenter);
      const height = newPoly[2].y - newPoly[1].y;
      Heights.push(height);
    }
    return { SquaresAndRectangles, Centers, Heights };
  });

  const appletObjects: AppletObject[] = $derived.by(() => {
    const appletObjects: AppletObject[] = [];
    SquaresAndRectangles.forEach((poly, ip) => {
      appletObjects.push(new Polygon(poly, PrimeColor.blue, { fillStyle: 'none', width: 0.5 }));
      if (ip > 0) {
        appletObjects.push(
          new Polygon(poly, PrimeColor.blue + PrimeColor.opacity(0.15), {
            fillStyle: 'full',
            width: 0.1
          })
        );
      }
    });
    Centers.forEach((point, pi) => {
      const denom = Math.pow(2, pi + 1);
      appletObjects.push(
        new Text(
          '\\frac{1}{' + denom.toFixed(0) + '}',
          point,
          PrimeColor.black,
          { alignX: 'center', alignY: 'center' },
          0.4 * Heights[pi]
        )
      );
    });
    return appletObjects;
  });
</script>

<Canvas2D {controls} {initialViewBox} {axis}>
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
