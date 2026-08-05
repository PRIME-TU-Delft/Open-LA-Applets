<script lang="ts" module>
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Vector2D from './Vector2D.svelte';

  export type VectorField2DProps = {
    f: (x: number, y: number) => Vector2;
    xRange?: [number, number];
    yRange?: [number, number];
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
  let {
    f,
    xRange = [-GRID_SIZE_2D, GRID_SIZE_2D],
    yRange = [-GRID_SIZE_2D, GRID_SIZE_2D],
    step = 1,
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
    for (let i = 1; i <= steps - 1; i++) {
      // Use 1:steps-1 to avoid min and max due to floating point errors
      values.push(min + i * stepSize);
    }

    values.push(max); // Ensure the max value is included explicitly

    return values;
  };

  let xValues = $derived.by(() => buildRangeValues(xRange[0], xRange[1], step));
  let yValues = $derived.by(() => buildRangeValues(yRange[0], yRange[1], step));
</script>

{#each yValues as y, i (i)}
  {#each xValues as x, j (i.toString() + '-' + j.toString())}
    {@const length = normalize ? (normalizedLength ?? 1) : new Vector2(x, y).length()}
    {@const origin =
      anchor === 'start'
        ? new Vector2(x, y)
        : anchor === 'end'
          ? new Vector2(x, y).add(f(x, y).clone().normalize().multiplyScalar(length))
          : new Vector2(x, y).sub(
              f(x, y)
                .clone()
                .normalize()
                .multiplyScalar(length / 2)
            )}

    {#if Math.sqrt(f(x, y).x ** 2 + f(x, y).y ** 2) > 1e-6}
      // Only draw non-near-zero vectors
      <Vector2D
        {origin}
        direction={f(x, y)}
        {length}
        color={colorFn ? colorFn(x, y) : color}
        {hideHead}
      />
    {/if}
  {/each}
{/each}
