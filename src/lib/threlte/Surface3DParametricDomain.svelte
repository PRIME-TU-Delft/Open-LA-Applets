<script lang="ts" module>
  import { Vector2 } from 'three';

  export type Surface3DProps = {
    func: (x: number, y: number) => number;
    xFunc: (t: number) => number;
    yFunc: (t: number) => number;

    tRange?: number[];
    internalPoints?: Vector2[];

    resolution?: number;

    color?: string;
    opacity?: number;
    wireframe?: boolean;
    surface?: boolean;
    wireColor?: string;
  };
</script>

<script lang="ts">
  import { T } from '@threlte/core';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Surface3D from '$lib/threlte/Surface3D.svelte';
  import { BufferAttribute, BufferGeometry, DoubleSide } from 'three';

  import cdt2d from 'cdt2d';

  type Point = [number, number];

  let {
    func,
    xFunc,
    yFunc,
    tRange = [0, 1],
    internalPoints = [],
    resolution = 10,
    color = PrimeColor.blue,
    opacity = 0.7,
    wireframe = false,
    surface = wireframe ? false : true,
    wireColor = color
  }: Surface3DProps = $props();

  // create the polygon that approximates the given parametric curve
  const polygon: Vector2[] = [];
  const numberOfSegments = tRange.length - 1;
  for (let iter = 0; iter < numberOfSegments; iter++) {
    // for each segment divide the t values in resolution pieces
    // for each segment we skip the last value, as that is the first of the next (or first) segment
    for (let reti = 0; reti < resolution; reti++) {
      const tStart = tRange[iter];
      const tEnd = tRange[iter + 1];
      const t = tStart * (1 - reti / resolution) + tEnd * (reti / resolution);
      const x = xFunc(t);
      const y = yFunc(t);
      polygon.push(new Vector2(x, y));
    }
  }
</script>

<Surface3D
  {func}
  {polygon}
  {internalPoints}
  resolution={1}
  {color}
  {opacity}
  {wireframe}
  {surface}
  {wireColor}
/>
