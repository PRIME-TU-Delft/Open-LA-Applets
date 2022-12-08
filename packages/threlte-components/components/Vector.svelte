<script lang="ts">
  import { T } from '@threlte/core';
  import { Line2 } from 'three/examples/jsm/lines/Line2';

  import { DoubleSide, Vector3, Mesh, Quaternion } from 'three';

  import getRandomColor from 'utils/PrimeColors';
  import ThrelteLabel from 'utils/ThrelteLabel';

  import Label from './Label.svelte';
  import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';

  export let color: string = getRandomColor(); //Color of both cone and stem
  export let origin: Vector3 = new Vector3(0, 0, 0); // origin of vector
  export let direction: Vector3 = new Vector3(1, 0, 0); // direction of vector
  export let striped = false; // whether the line is striped
  export let length = 1; // length of the vector + cone
  export let radius = 0.05; // radius of the cone
  // export let showDeconstruction = false; // show deconstruction of vector
  export let hideHead = false; // hide the cone
  export let label: ThrelteLabel = ThrelteLabel.default(); // label of vector

  const RADIUS_SEGMENTS = 15; // number of segements on the tube -> higher is smoother
  const CONE_HEIGHT = 0.5;

  let coneMesh: Mesh;
  let line: Line2;
  let endPoint: Vector3;

  $: coneHeight = hideHead ? 0 : CONE_HEIGHT;

  $: direction = direction.clone().normalize();

  $: {
    const geometry = new LineGeometry();
    geometry.setPositions([origin.x, origin.y, origin.z, endPoint.x, endPoint.y, endPoint.z]);
    if (line) {
      line.geometry = geometry;

      line.material.dashed = true;
    }
  }

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

  console.warn('Implement striped', striped);
</script>

<!-- Line is length minus cone height -->
<T.Line2 bind:ref={line}>
  <T.LineMaterial worldUnits linewidth={radius} dashScale={10} {color} />
</T.Line2>

<!-- Cone on top of line -->
{#if !hideHead}
  <T.Mesh position={conePosition.toArray()} bind:ref={coneMesh}>
    <T.MeshBasicMaterial {color} side={DoubleSide} />
    <T.ConeGeometry args={[radius * 2, CONE_HEIGHT, RADIUS_SEGMENTS]} />
  </T.Mesh>
{/if}

<Label {color} {label} start={origin} end={endPoint} />
