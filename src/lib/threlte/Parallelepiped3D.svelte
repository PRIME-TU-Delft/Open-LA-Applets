<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import {
    BufferAttribute,
    BufferGeometry,
    DoubleSide,
    type FrontSide,
    type BackSide,
    Vector3
  } from 'three';
  import Line3D from './Line3D.svelte';
  import { onDestroy } from 'svelte';

  type Parallelopiped3DProps = {
    points: [Vector3, Vector3, Vector3];
    offset?: Vector3;
    color?: string;
    strokeWidth?: number;
    strokeColor?: string;
    opacity?: number;
    side?: typeof FrontSide | typeof BackSide | typeof DoubleSide;
  };

  let {
    points,
    offset = new Vector3(),
    color = PrimeColor.black,
    strokeWidth = 1,
    strokeColor = PrimeColor.black,
    opacity = 1,
    side = DoubleSide
  }: Parallelopiped3DProps = $props();

  const offsetPoints = $derived(points.map((point) => point.clone().add(offset)));
  const p3 = $derived(offsetPoints[1].clone().add(offsetPoints[2]).sub(offsetPoints[0]));

  const geometry = $derived.by(() => {
    const geom = new BufferGeometry();

    const vertices = new Float32Array(
      [
        offsetPoints[0].toArray(),
        offsetPoints[1].toArray(),
        offsetPoints[2].toArray(),
        p3.toArray()
      ].flat()
    );
    geom.setAttribute('position', new BufferAttribute(vertices, 3));

    const indices = new Uint16Array([0, 2, 3, 0, 3, 1]);
    geom.setIndex(new BufferAttribute(indices, 1));

    return geom;
  });

  onDestroy(() => {
    geometry.dispose();
  });
</script>

<T.Mesh {geometry}>
  <T.MeshBasicMaterial {side} {color} transparent={opacity < 1} {opacity} />
</T.Mesh>

<Line3D
  origin={offsetPoints[0]}
  endPoint={offsetPoints[1]}
  radius={strokeWidth}
  color={strokeColor}
/>
<Line3D
  origin={offsetPoints[0]}
  endPoint={offsetPoints[1]}
  radius={strokeWidth}
  color={strokeColor}
/>
<Line3D origin={p3} endPoint={offsetPoints[1]} radius={strokeWidth} color={strokeColor} />
<Line3D origin={p3} endPoint={offsetPoints[2]} radius={strokeWidth} color={strokeColor} />
