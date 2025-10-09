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

  const controls = Controls.addSlider(-3, -5, 0, 0.1, PrimeColor.darkGreen) // b
    .addSlider(3, 0, 5, 0.1, PrimeColor.raspberry) // a
    .addSlider(10, 1, 10, 1, PrimeColor.blue); // numRectangles

  const func = (x: number, y: number) => 5 - (1 / 5) * (x ** 2 + y ** 2);
  const func_display =
    '\\int_{\\$1}^{\\$2} \\int_{\\$3}^{\\$4} \\left(5 - \\frac{1}{5}(x^2 + y^2)\\right)~dx~dy~~=~~\\$5';

  const formulas = $derived.by(() => {
    const a = round(controls[0]);
    const b = round(controls[1]);
    const numRectangles = round(controls[2]);
    const dx = (b - a) / numRectangles;
    const dy = dx;
    const result = integrate((x) => integrate((y) => func(x, y), a, b), a, b);

    const f1 = new Formula(func_display)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(result, PrimeColor.blue);

    return new Formulas(f1);
  });

  let method: 'center' | 'random' = 'center';

  const rects = $derived.by(() => {
    const a = controls[0];
    const b = controls[1];
    const numRectangles = controls[2];
    const dx = (b - a) / numRectangles;
    const dy = dx;
    const newRects = [];
    for (let i = 0; i < numRectangles; i++) {
      for (let j = 0; j < numRectangles; j++) {
        let x = a + i * dx + (method === 'random' ? Math.random() * dx : dx / 2);
        let y = a + j * dy + (method === 'random' ? Math.random() * dy : dy / 2);
        const z = func(x, y);
        newRects.push({
          points: [new Vector3(x, y, 0), new Vector3(x + dx, y + dy, z)] as [Vector3, Vector3]
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
    opacity={0.3}
  />

  <!-- DEBUG -->
  <!-- <Cuboid3D
    corners={[new Vector3(0, 0, 0), new Vector3(1, 2, 3)]}
    color={PrimeColor.raspberry}

  /> -->
  {#each rects as rect}
    <!-- HOTFIXED BELOW -->
    <!-- <Cuboid3D
      corners={rect.points}
      color={PrimeColor.raspberry}
    />
    <Latex3D
      latex={`h=${round(rect.points[1].z, 2)}`}
      fontSize={0.5}
      position={new Vector3(
        (rect.points[0].x + rect.points[1].x) / 2,
        (rect.points[0].y + rect.points[1].y) / 2,
        rect.points[1].z + (rect.points[1].z > 0 ? 0.2 : -0.2)
      )}
      color="black"
    /> -->
    <Cuboid3D
      corners={[
        new Vector3(rect.points[0].y, rect.points[0].z, rect.points[0].x),
        new Vector3(rect.points[1].y, rect.points[1].z, rect.points[1].x)
      ]}
      color={PrimeColor.blue}
    />
    <Latex3D
      latex={`h=${round(rect.points[1].z, 2)}`}
      fontSize={0.5}
      position={new Vector3(
        (rect.points[0].y + rect.points[1].y) / 2,
        rect.points[1].z + (rect.points[1].z > 0 ? 0.2 : -0.2),
        (rect.points[0].x + rect.points[1].x) / 2
      )}
      color="black"
    />
  {/each}
</Canvas3D>
