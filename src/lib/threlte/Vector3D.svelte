<script lang="ts" module>
  export type Vector3DProps = {
    color?: string;
    origin?: Vector3;
    direction?: Vector3;
    isDashed?: boolean;
    length?: number;
    radius?: number;
    hideHead?: boolean;
    alwaysOnTop?: boolean;
    noNormalise?: boolean;
    children?: Snippet<[Vector3 | undefined]>;
  };
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { DoubleSide, Mesh, Quaternion, Vector3 } from 'three';
  import Line3D from './Line3D.svelte';
  import type { Snippet } from 'svelte';
  import Point3D from './Point3D.svelte';

  let {
    color = PrimeColor.getRandomColor(),
    origin = new Vector3(0, 0, 0),
    direction = new Vector3(1, 0, 0),
    isDashed = false,
    length = undefined,
    radius = 1,
    hideHead = false,
    alwaysOnTop = false,
    noNormalise = false,
    children
  }: Vector3DProps = $props();

  const RADIUS_SEGMENTS = 15; // number of segements on the tube -> higher is smoother
  const CONE_HEIGHT = 0.5;
  const CONE_DIAMETER = 0.1;

  let coneMesh = $state<Mesh>();
  const threltheDirection = new Vector3(direction.x, direction.z, direction.y);
  const normalizedDirection = $derived(noNormalise ? threltheDirection : threltheDirection.clone().normalize());
  const vectorLength = $derived(length ?? direction.length());
  const endPoint = $derived(
    origin.clone().add(normalizedDirection.clone().multiplyScalar(vectorLength))
  );
  const coneHeight = $derived(hideHead ? 0 : CONE_HEIGHT);
  const lineEnd = $derived(
    origin
      .clone()
      .add(
        normalizedDirection
          .clone()
          .multiplyScalar(vectorLength + (length && length < 0 ? coneHeight : -coneHeight))
      )
  );
  const conePosition = $derived.by(() => {
    const directionVector = normalizedDirection.clone().multiplyScalar(coneHeight / 2);

    if (length && length < 0) {
      return lineEnd.clone().sub(directionVector);
    }

    return lineEnd.clone().add(directionVector);
  });

  $effect(() => {
    // 😃 hipedihopedie quaternions fix all the things
    const quatRotation = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      endPoint.clone().sub(origin).normalize()
    );

    if (coneMesh) coneMesh.setRotationFromQuaternion(quatRotation);
  });
</script>

<Line3D {origin} endPoint={lineEnd} {color} {radius} {isDashed} {alwaysOnTop} />

<!-- Cone on top of line -->
{#if !hideHead}
  {#if length == 0}
    <Point3D position={origin} {color} />
  {:else}
    <T.Mesh position={conePosition.toArray()} bind:ref={coneMesh}>
      <T.MeshBasicMaterial {color} side={DoubleSide} />
      <T.ConeGeometry args={[CONE_DIAMETER * radius, CONE_HEIGHT, RADIUS_SEGMENTS]} />
    </T.Mesh>
  {/if}
{/if}

{#if children}
  {@render children(endPoint)}
{/if}
