<script lang="ts">
  /**
   * This component is defined by a normal vector and a center position.
   */

  import { Mesh } from '@threlte/core';

  import getRandomColor from 'ui/utils/primeColors';
  import PlaneSegments from './PlaneSegments';

  import { PlaneGeometry, MeshBasicMaterial, DoubleSide, Vector3 } from 'three';

  export let position: Vector3 = new Vector3(0, 0, 0);
  export let normal: Vector3 = new Vector3(1, 1, 1);
  export let color = getRandomColor();
  export let size = 10;
  export let opacity = 1;
  export let planeSegment = PlaneSegments.default();

  let geometry = new PlaneGeometry(size, size, planeSegment.segments, 1);
  let matrials = [new MeshBasicMaterial({ color, transparent: true, opacity, side: DoubleSide })];

  function setStripes() {
    if (!geometry) return;

    for (let i = 0; i < planeSegment.segments; i++) {
      if (i % planeSegment.interval == planeSegment.offset) {
        // A rectangle consists of two triangles --> 6 vertices
        geometry.addGroup(i * 6, 6, 0);
      }
    }
  }

  $: {
    if (planeSegment.segments > 1) setStripes();
  }

  $: normal = normal.normalize();
</script>

<Mesh lookAt={normal} {position} {geometry} material={matrials} />
