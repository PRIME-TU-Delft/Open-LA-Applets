<script lang="ts">
  import { Line2, MeshInstance } from '@threlte/core';
  import { Text } from '@threlte/extras';
  import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

  import {
    Color,
    ConeGeometry,
    DoubleSide,
    MeshBasicMaterial,
    Vector3,
    Mesh,
    Quaternion
  } from 'three';

  import getRandomColor from 'utils/PrimeColors';
  import { Label } from 'utils/Label';

  export let color: string = getRandomColor(); //Color of both cone and stem
  export let origin: Vector3 = new Vector3(0, 0, 0); // origin of vector
  export let direction: Vector3 = new Vector3(1, 0, 0); // direction of vector
  export let striped = false; // whether the line is striped
  export let length = 1; // length of the vector + cone
  export let radius = 0.05; // radius of the cone
  // export let showDeconstruction = false; // show deconstruction of vector
  export let label: Label = Label.default(); // label of vector

  const RADIUS_SEGMENTS = 15; // number of segements on the tube -> higher is smoother
  const CONE_HEIGHT = 0.5;

  let coneMesh: Mesh;
  let material: LineMaterial;

  $: direction = direction.normalize();

  $: {
    // Line
    const threeColor = new Color(color);
    material = new LineMaterial({
      worldUnits: true,
      linewidth: radius,
      dashScale: 10,
      dashed: striped
    });
    material.color = threeColor;
  }

  $: {
    // Cone
    const coneMaterial = new MeshBasicMaterial({ color: new Color(color), side: DoubleSide });
    const coneGeometry = new ConeGeometry(radius * 2, CONE_HEIGHT, RADIUS_SEGMENTS);
    coneMesh = new Mesh(coneGeometry, coneMaterial);

    const endPoint = origin.clone().add(
      direction
        .clone()
        .normalize()
        .multiplyScalar(length - CONE_HEIGHT / 2)
    );

    // 😃 hipedihopedie quaternions fix all the things
    const quatRotation = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      endPoint.clone().sub(origin).normalize()
    );

    coneMesh.setRotationFromQuaternion(quatRotation);
  }
</script>

<!-- Line is length minus cone height -->
<Line2
  points={[origin, origin.clone().add(direction.clone().multiplyScalar(length - CONE_HEIGHT))]}
  {material}
/>

<!-- Cone on top of line -->
<MeshInstance
  mesh={coneMesh}
  position={origin.clone().add(
    direction
      .clone()
      .normalize()
      .multiplyScalar(length - CONE_HEIGHT / 2)
  )}
/>

{#if label.title}
  <Text
    color={label.color}
    position={origin.clone().add(
      direction
        .clone()
        .normalize()
        .multiplyScalar(length + 0.07)
    )}
    text={label.title}
  />
{/if}
