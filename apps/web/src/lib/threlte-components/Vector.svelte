<script lang="ts">
  import { T } from '@threlte/core';
  import { DoubleSide, Mesh, Quaternion, Vector3 } from 'three';
  import getRandomColor from 'utils/PrimeColors';
  import Line2 from './Line2.svelte';

  export let color: string = getRandomColor(); //Color of both cone and stem
  export let origin: Vector3 = new Vector3(0, 0, 0); // origin of vector
  export let direction: Vector3 = new Vector3(1, 0, 0); // direction of vector
  export let striped = false; // whether the line is striped
  export let length = 1; // length of the vector + cone
  export let radius = 0.05; // radius of the cone
  export let hideHead = false; // hide the cone
  export let alwaysOnTop = false; // whether the line is rendered on top of everything else

  const RADIUS_SEGMENTS = 15; // number of segements on the tube -> higher is smoother
  const CONE_HEIGHT = 0.5;
  const CONE_DIAMETER = 0.1;

  let coneMesh: Mesh;
  let endPoint: Vector3;

  $: coneHeight = hideHead ? 0 : CONE_HEIGHT;

  $: direction = direction.clone().normalize();

  $: {
    endPoint = origin.clone().add(
      direction
        .clone()
        .normalize()
        .multiplyScalar(length - coneHeight / 2)
    );

    // 😃 hipedihopedie quaternions fix all the things
    const quatRotation = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      endPoint.clone().sub(origin).normalize()
    );

    if (coneMesh) coneMesh.setRotationFromQuaternion(quatRotation);
  }

  $: conePosition = origin.clone().add(
    direction
      .clone()
      .normalize()
      .multiplyScalar(length - coneHeight / 2)
  );
</script>

<Line2 {origin} {endPoint} {color} {radius} {striped} {alwaysOnTop} />

<!-- Line is length minus cone height -->
<!-- <T.Line2 bind:ref={line}>
  <T.LineMaterial dashed={striped} worldUnits linewidth={radius} dashScale={10} {color} />
</T.Line2> -->

<!-- Cone on top of line -->
{#if !hideHead}
  <T.Mesh position={conePosition.toArray()} bind:ref={coneMesh}>
    <T.MeshBasicMaterial {color} side={DoubleSide} />
    <T.ConeGeometry args={[CONE_DIAMETER, CONE_HEIGHT, RADIUS_SEGMENTS]} />
  </T.Mesh>
{/if}

<slot {endPoint} />
