<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { integrate, round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Surface3D from '$lib/threlte/Surface3D.svelte';
  import Cuboid3D from '$lib/threlte/Cuboid3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import { Vector3 } from 'three';
    import Point3D from '$lib/threlte/Point3D.svelte';

  const methods = ['center', 'random', 'min', 'max'];

  const controls = Controls
    .addDropdown('', methods, PrimeColor.yellow)
    .addSlider(2, -5, 5, 0.1, PrimeColor.raspberry) // b
    .addSlider(10, 1, 20, 1, PrimeColor.blue); // numRectangles
  
  const func = (x: number, y: number) => 4 - (1 / 4) * (x ** 2 + y ** 2);
  const func_display =
  '\\int_{\\$1}^{\\$2} \\int_{\\$3}^{\\$4} \\left(4 - \\frac{1}{4}(x^2 + y^2)\\right)~dx~dy~~=~~\\$5';

  const formulas = $derived.by(() => {
    const a = -round(controls[1]);
    const b = round(controls[1]);
    const numRectangles = round(controls[2]);
    const dx = (b - a) / numRectangles;
    const dy = dx;

    const result = integrate((x) => integrate((y) => func(x, y), a, b), a, b);

    const f1 = new Formula(func_display)
      .addAutoParam(a, PrimeColor.raspberry)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(a, PrimeColor.raspberry)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(result.toFixed(3), PrimeColor.blue);

    const riemannSum = rects.reduce((sum, rect) => sum + Math.max(rect.points[0].z, rect.points[1].z) * dx * dy, 0);
    const riemann_display = '\\sum_{i=1}^{n} \\sum_{j=1}^{n} f(x_i^*, y_j^*) \\Delta x \\Delta y~~=~~\\$1,~~n=\\$2,~~\\Delta x=\\$3';

    const f2 = new Formula(riemann_display)
      .addAutoParam(riemannSum.toFixed(3), PrimeColor.orange)
      .addAutoParam(numRectangles, PrimeColor.blue)
      .addAutoParam(round(dx, 4), PrimeColor.raspberry);

    return new Formulas(f1, f2);
  });

  const rects = $derived.by(() => {
    const a = -controls[1];
    const b = controls[1];
    const numRectangles = controls[2];
    const dx = (b - a) / numRectangles;
    const dy = dx;
    const newRects = [];
    for (let i = 0; i < numRectangles; i++) {
      for (let j = 0; j < numRectangles; j++) {
        let x: number;
        let y: number;

        const x_i = a + i * dx;
        const y_j = a + j * dy;

        if (controls[0] === 'center') {
          x = x_i + 0.5 * dx;
          y = y_j + 0.5 * dy;
        } else if (controls[0] === 'random') {
          x = x_i + Math.random() * dx;
          y = y_j + Math.random() * dy;
        } else if (controls[0] === 'min') {
          // Find the minimum value of func in [(x1, y1), (x2, y2)] by sampling
          const x1 = x_i;
          const x2 = x1 + dx;
          const y1 = y_j;
          const y2 = y1 + dy;
          const samples_one_axis = 10;
          let minX = x1;
          let minY = y1;
          let minZ = func(x1, y1);
          for (let sx = 0; sx <= samples_one_axis; sx++) {
            for (let sy = 0; sy <= samples_one_axis; sy++) {
              const xs = x1 + (sx * (x2 - x1)) / samples_one_axis;
              const ys = y1 + (sy * (y2 - y1)) / samples_one_axis;
              const zs = func(xs, ys);
              if (zs < minZ) {
                minZ = zs;
                minX = xs;
                minY = ys;
              }
            }
          }
          x = minX;
          y = minY;
        } else if (controls[0] === 'max') {
          // Find the maximum value of func in [(x1, y1), (x2, y2)] by sampling
          const x1 = x_i;
          const x2 = x1 + dx;
          const y1 = y_j;
          const y2 = y1 + dy;
          const samples_one_axis = 10;
          let maxX = x1;
          let maxY = y1;
          let maxZ = func(x1, y1);
          for (let sx = 0; sx <= samples_one_axis; sx++) {
            for (let sy = 0; sy <= samples_one_axis; sy++) {
              const xs = x1 + (sx * (x2 - x1)) / samples_one_axis;
              const ys = y1 + (sy * (y2 - y1)) / samples_one_axis;
              const zs = func(xs, ys);
              if (zs > maxZ) {
                maxZ = zs;
                maxX = xs;
                maxY = ys;
              }
            }
          }
          x = maxX;
          y = maxY;
        } else {
          x = x_i + 0.5 * dx;
          y = y_j + 0.5 * dy;
        }

        const z = func(x, y);
        const color = z >= 0 && b >= a ? PrimeColor.darkGreen : PrimeColor.raspberry;

        newRects.push({
          points: [
            new Vector3(y_j, 0, x_i),
            new Vector3(y_j + dy, z, x_i + dx)
          ] as [Vector3, Vector3],
          samplePosition: new Vector3(y, z, x),
          color // Add color to the rect object
        });
      }
    }
    return newRects;
  });
</script>

<Canvas3D {controls} {formulas} cameraZoom={100}>
  <Axis3D showNumbers={true} axisLength={5} axisSpacing={1} />
  <Surface3D
    {func}
    xRange={[-5, 5]}
    yRange={[-5, 5]}
    resolution={50}
    color={PrimeColor.blue}
    opacity={0.2}
  />
  {#each rects as rect}
    <Cuboid3D
      corners={rect.points}
      color={rect.color}
    />
  {/each}
  {#each rects as rect}
    <Point3D
      position={rect.samplePosition}
      color={PrimeColor.blue}
      size={0.05}
      alwaysOnTop={true}
    />
  {/each}
</Canvas3D>
