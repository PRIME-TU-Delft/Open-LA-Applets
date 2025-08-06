<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import {
    BufferAttribute,
    BufferGeometry,
    DoubleSide,
    Vector3,
    type BackSide,
    type FrontSide
  } from 'three';

  export type Polygon3DProps = {
    points: Vector3[];
    offset?: Vector3;
    color?: string;
    opacity?: number;
    side?: typeof FrontSide | typeof BackSide | typeof DoubleSide;
  };

  let {
    points,
    offset = new Vector3(),
    color = PrimeColor.black,
    opacity = 1,
    side = DoubleSide
  }: Polygon3DProps = $props();

  const offsetPoints = $derived(points.map((point) => point.clone().add(offset)));

  const geometry = $derived.by(() => {
    const geom = new BufferGeometry();

    const vertices = new Float32Array(offsetPoints.map((point) => point.toArray()).flat());

    geom.setAttribute('position', new BufferAttribute(vertices, 3));

    const indices = new Uint16Array(
      Array.from({ length: offsetPoints.length - 2 }, (_, i) => [0, i + 1, i + 2]).flat()
    );

    geom.setIndex(new BufferAttribute(indices, 1));

    return geom;
  });
</script>

<T.Mesh {geometry}>
  <T.MeshBasicMaterial {side} {color} transparent={opacity < 1} {opacity} />
</T.Mesh>
