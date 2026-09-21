<script lang="ts" module>
  import { GRID_SIZE_3D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  export type VectorField3DProps = {
    f: (x: number, y: number, z: number) => Vector3;
    xRange?: [number, number];
    yRange?: [number, number];
    zRange?: [number, number];
    step?: number;
    color?: PrimeColor;
    normalize?: boolean;
    normalizedLength?: number;
    hideHead?: boolean;
    anchor?: 'middle' | 'start' | 'end';
    colorFn?: (x: number, y: number) => PrimeColor | string;
  };
</script>

<script>
  const sx = 1;
  const sy = 1;
  const sz = 1;

  const VECTOR_CAP = 2000;

  let {
    f,
    xRange = [-GRID_SIZE_3D / sx, GRID_SIZE_3D / sx],
    yRange = [-GRID_SIZE_3D / sy, GRID_SIZE_3D / sy],
    zRange = [-GRID_SIZE_3D / sz, GRID_SIZE_3D / sz],
    step = 2,
    color = PrimeColor.black,
    normalize = true,
    normalizedLength = 1,
    hideHead = false,
    anchor = 'middle',
    colorFn = undefined
  } = $props();

  const buildRangeValues = (min: number, max: number, stepSize: number) => {
    if (stepSize <= 0) {
      return [min];
    }

    const values: number[] = [];
    values.push(min); // Ensure the min value is included explicitly

    // Instead of using floating point arithmetic, we calculate explicitly
    // the number of steps to avoid precision issues.
    const steps = Math.round((max - min) / stepSize); // round, assuming stepSize divides the range evenly
    const newStepSize = (max - min) / steps; // recalculate step size to avoid floating point errors
    for (let i = 1; i <= steps - 1; i++) {
      // Use 1:steps-1 to avoid min and max due to floating point errors
      values.push(min + i * newStepSize);
    }

    values.push(max); // Ensure the max value is included explicitly

    return values;
  };

  const effectiveStep = $derived.by(() => {
    if (step <= 0) return step;

    const xSpan = xRange[1] - xRange[0];
    const ySpan = yRange[1] - yRange[0];
    const zSpan = zRange[1] - zRange[0];

    const countAt = (s: number) => {
      const nx = Math.max(1, Math.round(xSpan / s) + 1);
      const ny = Math.max(1, Math.round(ySpan / s) + 1);
      const nz = Math.max(1, Math.round(zSpan / s) + 1);
      return nx * ny * nz;
    };

    const total = countAt(step);
    if (total <= VECTOR_CAP) return step;

    const factor = Math.cbrt(total / VECTOR_CAP);
    return step * factor;
  });

  let xValues = $derived.by(() => buildRangeValues(xRange[0], xRange[1], effectiveStep));
  let yValues = $derived.by(() => buildRangeValues(yRange[0], yRange[1], effectiveStep));
  let zValues = $derived.by(() => buildRangeValues(zRange[0], zRange[1], effectiveStep));
</script>

{#each zValues as z, k (k)}
  {#each yValues as y, i (i.toString() + '-' + k.toString())}
    {#each xValues as x, j (i.toString() + '-' + k.toString() + '-' + j.toString())}
      {@const length = normalize ? (normalizedLength ?? 1) : new Vector3(x, y, z).length()}
      {@const origin =
        anchor === 'start'
          ? new Vector3(x, y, z)
          : anchor === 'end'
            ? new Vector3(x, y, z).add(f(x, y, z).clone().normalize().multiplyScalar(length))
            : new Vector3(x, y, z).sub(
                f(x, y, z)
                  .clone()
                  .normalize()
                  .multiplyScalar(length / 2)
              )}

      {#if Math.sqrt(f(x, y, z).x ** 2 + f(x, y, z).y ** 2 + f(x, y, z).z ** 2) > 1e-6}
        // Only draw non-near-zero vectors
        <Vector3D
          {origin}
          direction={f(x, y, z)}
          {length}
          color={colorFn ? colorFn(x, y, z) : color}
          {hideHead}
        />
      {/if}
    {/each}
  {/each}
{/each}
