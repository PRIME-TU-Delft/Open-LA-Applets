<script lang="ts">
  /**
   * This component is defined by a normal vector and a center position.
   */

  import { MeshInstance } from '@threlte/core';

  import getRandomColor from 'utils/PrimeColors';
  import PlaneSegments from 'utils/Segments';

  import Vector from '../Vector.svelte';

  import {
    PlaneGeometry,
    MeshBasicMaterial,
    DoubleSide,
    Vector3,
    Mesh as ThreeMesh,
    Quaternion
  } from 'three';

  export let position: Vector3 = new Vector3(0, 0, 0);
  export let normal: Vector3 = new Vector3(1, 1, 1);
  export let color = getRandomColor();
  export let size = 10;
  export let opacity = 0.8;
  export let planeSegment = PlaneSegments.default();

  let geometry = new PlaneGeometry(size, size, planeSegment.segments, 1);
  let matrials = [new MeshBasicMaterial({ color, transparent: true, opacity, side: DoubleSide })];
  $: mesh = new ThreeMesh(geometry, matrials);

  function setStripes() {
    geometry = new PlaneGeometry(size, size, planeSegment.segments, 1);

    for (let i = 0; i < planeSegment.segments; i++) {
      if (i % planeSegment.interval == planeSegment.offset) {
        // A rectangle consists of two triangles --> 6 vertices
        geometry.addGroup(i * 6, 6, 0);
      }
    }
  }

  $: {
    if (planeSegment.segments > 1) setStripes();
    mesh = new ThreeMesh(geometry, matrials);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;

    mesh.setRotationFromQuaternion(
      new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal)
    );
  }

  $: normal = normal.normalize();
</script>

<Vector origin={position} direction={normal} color="black" striped length={2} />

<!-- TODO: replace MeshInstance with T.Mesh -->
<MeshInstance {mesh} />
