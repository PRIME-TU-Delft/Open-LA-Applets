<script lang="ts">
  import { BufferAttribute, BufferGeometry, LineSegments, type Vector3 } from 'three';
  import { T } from '@threlte/core';
  import { Line3D } from '.';

  export let points: [Vector3, Vector3, Vector3];
  export let color: string = 'black';
  export let strokeWidth: number = 1;

  $: p3 = points[1].clone().add(points[2]).sub(points[0]);

  let geometry = new BufferGeometry();

  function setGeometry(p0: Vector3, p1: Vector3, p2: Vector3) {
    const geometry = new BufferGeometry();

    const vertices = new Float32Array(
      [p0.toArray(), p1.toArray(), p2.toArray(), p3.toArray()].flat()
    );
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));

    const indices = new Uint16Array([0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2]);
    geometry.setIndex(new BufferAttribute(indices, 1));

    return geometry;
  }

  $: geometry = setGeometry(points[0], points[1], points[2]);
</script>

<T.Mesh {geometry}>
  <T.MeshBasicMaterial {color} />
</T.Mesh>

<Line3D points={[points[0], points[1]]} radius={strokeWidth * 0.05} color="black" />
<Line3D points={[points[0], points[2]]} radius={strokeWidth * 0.05} color="black" />
<Line3D points={[p3, points[1]]} radius={strokeWidth * 0.05} color="black" />
<Line3D points={[p3, points[2]]} radius={strokeWidth * 0.05} color="black" />
