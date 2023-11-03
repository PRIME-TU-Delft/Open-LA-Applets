<script lang="ts">
  import getRandomColor from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Line from './Line.svelte';
  import Triangle from './Triangle.svelte';
  import { VECTOR_WIDTH } from '$lib/utils/AttributeDimensions';

  export let color: string = getRandomColor(); //Color of both cone and stem
  export let origin: Vector2 = new Vector2(0, 0); // origin of vector
  export let direction: Vector2 = new Vector2(1, 0); // direction of vector
  export const striped = false; // TODO: whether the line is striped
  export let length = 1; // length of the vector + cone
  export let radius = VECTOR_WIDTH; // radius of the stem
  export let hideHead = false; // hide the cone
  export let isDashed = false;

  const CONE_HEIGHT = 0.5;
  const CONE_DIAMETER = 0.12;

  let endPoint = origin.clone().add(direction.clone().multiplyScalar(length)); // store with tip of the vector
  $: coneHeight = hideHead ? 0 : CONE_HEIGHT;
  $: direction = direction.clone().normalize();

  $: {
    endPoint = origin.clone().add(direction.clone().multiplyScalar(length));
  }

  $: coneStart = origin.clone().add(direction.clone().multiplyScalar(length - coneHeight / 2));
  $: leftConePoint = coneStart
    .clone()
    .add(new Vector2(-direction.y, direction.x).normalize().multiplyScalar(CONE_DIAMETER));
  $: rightConePoint = coneStart
    .clone()
    .add(new Vector2(direction.y, -direction.x).normalize().multiplyScalar(CONE_DIAMETER));
</script>

<Line start={origin} end={coneStart} {color} width={radius} {isDashed} />

{#if !hideHead}
  <Triangle points={[leftConePoint, endPoint, rightConePoint]} {color} />
{/if}

<slot {endPoint} />
