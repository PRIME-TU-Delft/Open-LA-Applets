<script lang="ts">
  import { Vector2 } from 'three';
  import getRandomColor from 'utils/PrimeColors';
  import Line from './Line.svelte';
  import Triangle from './Triangle.svelte';

  export let color: string = getRandomColor(); //Color of both cone and stem
  export let origin: Vector2 = new Vector2(0, 0); // origin of vector
  export let direction: Vector2 = new Vector2(1, 0); // direction of vector
  export const striped = false; // TODO: whether the line is striped
  export let length = 1; // length of the vector + cone
  export let radius = 2; // radius of the cone
  export let hideHead = false; // hide the cone

  const CONE_HEIGHT = 0.5;
  const CONE_DIAMETER = 0.1;

  let endPoint: Vector2; // tip of the vector

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

<!-- Line is length minus cone height -->
<Line start={[origin.x, origin.y]} end={[coneStart.x, coneStart.y]} {color} width={radius} />

{#if !hideHead}
  <Triangle points={[leftConePoint, endPoint, rightConePoint]} {color} />
{/if}

<slot {endPoint} />
