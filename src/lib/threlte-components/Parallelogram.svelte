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
  import { Line3D } from '.';

  export let points: [Vector3, Vector3, Vector3];
  export let offset: Vector3 = new Vector3();
  export let color: string = PrimeColor.black;
  export let strokeWidth: number = 1;
  export let strokeColor: string = PrimeColor.black;
  export let opacity = 1;
  export let side: typeof FrontSide | typeof BackSide | typeof DoubleSide = DoubleSide;

  $: offsetPoints = points.map((point) => point.clone().add(offset));
  $: p3 = offsetPoints[1].clone().add(offsetPoints[2]).sub(offsetPoints[0]);

  let geometry = new BufferGeometry();

  function setGeometry(p0: Vector3, p1: Vector3, p2: Vector3) {
    const geometry = new BufferGeometry();

    const vertices = new Float32Array(
      [p0.toArray(), p1.toArray(), p2.toArray(), p3.toArray()].flat()
    );
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));

    const indices = new Uint16Array([0, 2, 3, 0, 3, 1]);
    geometry.setIndex(new BufferAttribute(indices, 1));

    return geometry;
  }

  $: geometry = setGeometry(offsetPoints[0], offsetPoints[1], offsetPoints[2]);
</script>

<T.Mesh {geometry}>
  <T.MeshBasicMaterial {side} {color} transparent={opacity < 1} {opacity} />
</T.Mesh>

<Line3D
  points={[offsetPoints[0], offsetPoints[1]]}
  radius={strokeWidth * 0.05}
  color={strokeColor}
/>
<Line3D
  points={[offsetPoints[0], offsetPoints[2]]}
  radius={strokeWidth * 0.05}
  color={strokeColor}
/>
<Line3D points={[p3, offsetPoints[1]]} radius={strokeWidth * 0.05} color={strokeColor} />
<Line3D points={[p3, offsetPoints[2]]} radius={strokeWidth * 0.05} color={strokeColor} />
