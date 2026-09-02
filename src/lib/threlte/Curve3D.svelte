<script lang="ts" module>
  import * as THREE from 'three';

  export type Curve3DProps = {
    xFunc: (t: number) => number;
    yFunc: (t: number) => number;
    zFunc: (t: number) => number;

    tRange?: [number, number];

    resolution?: number;
    color?: string;
    isDashed?: boolean;
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
  import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
  import { Line, Mesh } from 'three';

  let {
    xFunc,
    yFunc,
    zFunc,
    tRange = [0, 1],
    resolution = 500,
    color = PrimeColor.blue,
    isDashed = false,
    radius = 1,
    alwaysOnTop = false
  }: Curve3DProps = $props();

  const curve = new ParametricCurve((t) => [xFunc(t), yFunc(t), zFunc(t)], tRange);

  const points = curve.getPoints(resolution);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  let line = $state<Line>();
  let lineMesh = $state<Mesh>();

  $effect(() => {
    if (line && isDashed) {
      line.computeLineDistances();
    }
  });

  $effect(() => {
    if (!lineMesh) return;

    if (alwaysOnTop) lineMesh.renderOrder = 300;
  });
</script>

{#key alwaysOnTop}
  {#if radius > 0}
    <T.Mesh bind:ref={lineMesh} rotation={[(Math.PI / 2) * -1, 0, (Math.PI / 2) * -1]}>
      <MeshLineGeometry {points} />
      <MeshLineMaterial
        depthTest={!alwaysOnTop}
        width={radius / 200}
        {color}
        dashOffset={0.1}
        dashArray={0.02}
        dashRatio={isDashed ? 0.2 : 0}
        transparent={isDashed || alwaysOnTop}
      />
    </T.Mesh>
  {:else}
    <T.Line bind:ref={line} {geometry} rotation={[(Math.PI / 2) * -1, 0, (Math.PI / 2) * -1]}>
      {#if isDashed}
        <T.LineDashedMaterial {color} dashSize={0.2} gapSize={0.1} />
      {:else}
        <T.LineBasicMaterial {color} />
      {/if}
    </T.Line>
  {/if}
{/key}
