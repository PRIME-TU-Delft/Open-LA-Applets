<script lang="ts" module>
  import * as THREE from 'three';

  export type Curve3DProps = {
    xFunc: (t: number) => number;
    yFunc: (t: number) => number;
    zFunc: (t: number) => number;

    tRange?: [number, number];
    zRange?: [number, number];

    resolution?: number;
    color?: string;
    radius?: number;
    alwaysOnTop?: boolean;
  };

  class ParametricCurve extends THREE.Curve<THREE.Vector3> {
    private readonly f: (t: number) => [number, number, number];
    private readonly tRange: [number, number];

    constructor(f: (t: number) => [number, number, number], tRange: [number, number]) {
      super();
      this.f = f;
      this.tRange = tRange;
    }

    override getPoint(u: number): THREE.Vector3 {
      const t = this.tRange[0] + u * (this.tRange[1] - this.tRange[0]);
      const [x, y, z] = this.f(t);
      return new THREE.Vector3(x, y, z);
    }
  }
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { DoubleSide } from 'three';

  let {
    xFunc,
    yFunc,
    zFunc,
    tRange = [0, 1],
    zRange = [-10, 10],
    resolution = 500,
    color = PrimeColor.blue,
    radius = 1,
    alwaysOnTop = false
  }: Curve3DProps = $props();

  const curve = $derived(new ParametricCurve((t) => [xFunc(t), yFunc(t), zFunc(t)], tRange));
  const points = $derived(curve.getPoints(resolution));

  // break the sampled points into contiguous runs that lie inside zRange
  function splitByZRange(pts: THREE.Vector3[], [zMin, zMax]: [number, number]): THREE.Vector3[][] {
    const segments: THREE.Vector3[][] = [];
    let current: THREE.Vector3[] = [];

    for (const p of pts) {
      if (p.z >= zMin && p.z <= zMax) {
        current.push(p);
      } else if (current.length > 1) {
        segments.push(current);
        current = [];
      } else {
        current = [];
      }
    }

    if (current.length > 1) segments.push(current);

    return segments;
  }

  const segments = $derived(splitByZRange(points, zRange));

  // round, solid cross-section so the curve reads as a physical bar rather than a flat ribbon
  const tubeGeometries = $derived(
    segments.map(
      (segment) =>
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(segment),
          Math.max(segment.length - 1, 1),
          Math.max(radius / 40, 0.0001),
          12,
          false
        )
    )
  );

  const lineGeometries = $derived(
    segments.map((segment) => new THREE.BufferGeometry().setFromPoints(segment))
  );
</script>

{#key alwaysOnTop}
  {#if radius > 0}
    {#each tubeGeometries as tubeGeometry, i (i)}
      <T.Mesh
        geometry={tubeGeometry}
        rotation={[(Math.PI / 2) * -1, 0, (Math.PI / 2) * -1]}
        renderOrder={alwaysOnTop ? 300 : 0}
      >
        <T.MeshBasicMaterial
          {color}
          side={DoubleSide}
          depthTest={!alwaysOnTop}
          transparent={alwaysOnTop}
        />
      </T.Mesh>
    {/each}
  {:else}
    {#each lineGeometries as lineGeometry, i (i)}
      <T.Line geometry={lineGeometry} rotation={[(Math.PI / 2) * -1, 0, (Math.PI / 2) * -1]}>
        <T.LineBasicMaterial {color} />
      </T.Line>
    {/each}
  {/if}
{/key}
