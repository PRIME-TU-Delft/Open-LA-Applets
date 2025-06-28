<script lang="ts" module>
  export type Surface3DProps = {
    func: (x: number, y: number) => number;
    xRange?: [number, number];
    yRange?: [number, number];
    resolution?: number;
    color?: string;
    opacity?: number;
    wireframe?: boolean;
  };
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { BufferGeometry, BufferAttribute, DoubleSide } from 'three';

  let {
    func,
    xRange = [-5, 5],
    yRange = [-5, 5],
    resolution = 50,
    color = PrimeColor.blue,
    opacity = 0.7,
    wireframe = false
  }: Surface3DProps = $props();

  const geometry = $derived.by(() => {
    const vertices: number[] = [];
    const indices: number[] = [];

    // Generate vertices
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = xRange[0] + (i / resolution) * (xRange[1] - xRange[0]);
        const y = yRange[0] + (j / resolution) * (yRange[1] - yRange[0]);
        const z = func(x, y);

        vertices.push(x, y, z);
      }
    }

    // Generate indices
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const a = i * (resolution + 1) + j;
        const b = a + resolution + 1;
        const c = a + 1;
        const d = b + 1;

        indices.push(a, b, c);
        indices.push(c, b, d);
      }
    }

    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  });
</script>

<T.Mesh {geometry} rotation={[-Math.PI / 2, 0, 0]}>
  <!-- rotation is added so that z goes up -->
  <T.MeshBasicMaterial {color} transparent={opacity < 1} {opacity} side={DoubleSide} {wireframe} />
</T.Mesh>
