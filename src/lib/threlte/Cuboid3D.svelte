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

  export type Cuboid3DProps = {
    corners: [Vector3, Vector3];
    color?: string;
    opacity?: number;
    side?: typeof FrontSide | typeof BackSide | typeof DoubleSide;
  };

  let {
    corners,
    color = PrimeColor.black,
    opacity = 1,
    side = DoubleSide
  }: Cuboid3DProps = $props();

  const [c1, c2] = corners;

  const geometry = $derived.by(() => {
    const geom = new BufferGeometry();

    const vertices = [
      c1,
      new Vector3(c2.x, c1.y, c1.z),
      new Vector3(c2.x, c2.y, c1.z),
      new Vector3(c1.x, c2.y, c1.z),
      new Vector3(c1.x, c1.y, c2.z),
      new Vector3(c2.x, c1.y, c2.z),
      c2,
      new Vector3(c1.x, c2.y, c2.z)
    ];

    geom.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(vertices.map((v) => v.toArray()).flat()), 3)
    );

    const indices = [
      // Bottom face
      0, 1, 2, 0, 2, 3,
      // Top face
      4, 5, 6, 4, 6, 7,
      // Front face
      0, 1, 5, 0, 5, 4,
      // Back face
      3, 2, 6, 3, 6, 7,
      // Left face
      0, 3, 7, 0, 7, 4,
      // Right face
      1, 2, 6, 1, 6, 5
    ];

    geom.setIndex(new BufferAttribute(new Uint16Array(indices), 1));
    geom.computeVertexNormals();
    return geom;
  });
</script>

<T.Mesh {geometry}>
  <T.MeshBasicMaterial {side} {color} transparent={opacity < 1} {opacity} />
</T.Mesh>
