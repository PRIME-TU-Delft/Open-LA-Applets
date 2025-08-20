<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import Line3D from './Line3D.svelte';

  export type InfiniteLine3DProps = {
    origin?: Vector3;
    direction: Vector3;
    color?: string;
    isDashed?: boolean;
    radius?: number;
    alwaysOnTop?: boolean;
  };

  let {
    origin = new Vector3(0, 0, 0),
    direction = new Vector3(1, 0, 0),
    color = PrimeColor.getRandomColor(),
    isDashed = false,
    radius = 0,
    alwaysOnTop = false
  }: InfiniteLine3DProps = $props();
</script>

<!--@component
@props 
- origin: Vector3 = `new Vector3(0, 0, 0)` - The origin of the line
- endPoint: Vector3 = `new Vector3(0, 0, 0)` - The end point of the line
- color: string = `PrimeColor.getRandomColor()` - The color of the line
- isDashed: boolean = `false` - If the line is dashed
- radius: number = `0` - The radius of the line (0 means thin line, >0 means a tube)
- alwaysOnTop: boolean = `false` - If the line should always be on top

@example
<InfiniteLine3D direction={v} color={PrimeColor.blue} />
-->

<Line3D
  {origin}
  endPoint={origin.clone().add(direction.clone().normalize().multiplyScalar(30))}
  {color}
  {isDashed}
  {radius}
  {alwaysOnTop}
/>
<Line3D
  {origin}
  endPoint={origin.clone().add(direction.clone().normalize().multiplyScalar(-30))}
  {color}
  {isDashed}
  {radius}
  {alwaysOnTop}
/>
