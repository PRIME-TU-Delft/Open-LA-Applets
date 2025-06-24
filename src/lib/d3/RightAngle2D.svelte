<script lang="ts" module>
  export type RightAngle2DProps = {
    vs: [Vector2, Vector2];
    origin?: Vector2;
    size?: number;
    color?: string;
    lineWidth?: number;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import Line from './Line2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let {
    vs,
    origin = new Vector2(0, 0),
    size = 0.3,
    color = PrimeColor.black,
    lineWidth = 0.02
  }: RightAngle2DProps = $props();

  //resize vectors
  const u1 = $derived(vs[0].clone().multiplyScalar(size / vs[0].length()));
  const u2 = $derived(vs[1].clone().multiplyScalar(size / vs[1].length()));
</script>

<!-- @component 
@name RightAngle2D
@description Draw a right angle in 2D space.
@props
- vs: [Vector2, Vector2] - The two vectors that form the right angle.
- origin: Vector2 - The origin of the right angle.
- size: number - The size of the right angle.
- color: string - The color of the right angle.
- lineWidth: number - The width of the lines that form the right angle.

 @example
<RightAngle2D vs={[new Vector2(1, 0), new Vector2(0, 1)]} />
-->

<!-- draw two lines to represent right angle if perpendicular -->
{#if Math.abs(u1.dot(u2)) <= 0.005 && !u1.equals(u2)}
  <Line
    {color}
    width={lineWidth}
    start={u1.clone().add(origin)}
    end={u1.clone().add(u2).add(origin)}
  />
  <Line
    {color}
    width={lineWidth}
    start={u2.clone().add(origin)}
    end={u1.clone().add(u2).add(origin)}
  />
{/if}
