<script lang="ts">
  import { T } from '@threlte/core';
  import { BufferGeometry, DoubleSide, MeshLambertMaterial, PointsMaterial, Vector3 } from 'three';
  import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';

  import getRandomColor from 'utils/PrimeColors';

  export let color: string = getRandomColor();
  export let points: [Vector3, Vector3, Vector3] = [
    new Vector3(0, 0, 1),
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0)
  ];

  let meshGeometry: ConvexGeometry;

  const meshMaterial = new MeshLambertMaterial({
    color: color,
    opacity: 0.5,
    side: DoubleSide,
    transparent: true
  });
  $: {
    const p1 = points.at(0).clone().add(points.at(1));
    const p2 = points.at(0).clone().add(points.at(2));
    const p3 = points.at(1).clone().add(points.at(2));
    const p4 = points.at(0).clone().add(points.at(1)).add(points.at(2));
    const pts = [new Vector3(0, 0, 0), ...points, p1, p2, p3, p4];

    const vertices = pts.map((p) => {
      const v = new Vector3();
      v.copy(p);
      return v;
    });

    meshGeometry = new ConvexGeometry(vertices);
  }
</script>

<T.Mesh material={meshMaterial} geometry={meshGeometry} />
