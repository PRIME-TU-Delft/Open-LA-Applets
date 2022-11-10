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

  import getRandomColor from 'ui/utils/primeColors';
  import { Label } from '../utils/label';

  export let color: string = getRandomColor(); //Color of both cone and stem
  export let origin: Vector3 = new Vector3(0, 0, 0); // origin of vector
  export let direction: Vector3 = new Vector3(1, 0, 0); // direction of vector
  export let length = 1; // length of the vector + cone
  export let radius = 0.05; // radius of the cone
  // export let showDeconstruction = false; // show deconstruction of vector
  export let label: Label = Label.default(); // label of vector

  const RADIUS_SEGMENTS = 15; // number of segements on the tube -> higher is smoother

  let coneMesh: Mesh;
  let material: LineMaterial;

  $: direction = direction.normalize();

  $: coneHeight = Math.min(0.5, length / 10); // height of the cone
  $: {
    // Line
    const threeColor = new Color(color);
    material = new LineMaterial({
      worldUnits: true,
      linewidth: radius
    });
    material.color = threeColor;
  }

  $: {
    // Cone
    const coneMaterial = new MeshBasicMaterial({ color: new Color(color), side: DoubleSide });
    const coneGeometry = new ConeGeometry(radius * 2, coneHeight, RADIUS_SEGMENTS);
    coneMesh = new Mesh(coneGeometry, coneMaterial);

    const endPoint = origin.clone().add(
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

    coneMesh.setRotationFromQuaternion(quatRotation);
  }
</script>

<!-- Line is length minus cone height -->
<Line2
  points={[origin, origin.clone().add(direction.clone().multiplyScalar(length - coneHeight))]}
  {material}
/>

<!-- Cone on top of line -->
<MeshInstance
  mesh={coneMesh}
  position={origin.clone().add(
    direction
      .clone()
      .normalize()
      .multiplyScalar(length - coneHeight / 2)
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
