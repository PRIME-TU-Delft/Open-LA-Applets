<script lang="ts">
  import { writable } from 'svelte/store';
  import { Vector2 } from 'three';
  import getRandomColor from 'utils/PrimeColors';
  import { getCanvasContext, setLabelPosition } from './CanvasContext';
  import Line from './Line.svelte';
  import Triangle from './Triangle.svelte';
  import { onDestroy, onMount } from 'svelte';

  export let color: string = getRandomColor(); //Color of both cone and stem
  export let origin: Vector2 = new Vector2(0, 0); // origin of vector
  export let direction: Vector2 = new Vector2(1, 0); // direction of vector
  export const striped = false; // TODO: whether the line is striped
  export let length = 1; // length of the vector + cone
  export let radius = 3; // radius of the stem
  export let hideHead = false; // hide the cone
  export let isDashed = false;
  export let draggable = false;

  const CONE_HEIGHT = 0.5;
  const CONE_DIAMETER = 0.1;

  let draggables = getCanvasContext().draggables;
  const key = Symbol('vector');

  // NOTE: draggables won't get updated if the Vector is moved by some other means, e.g. sliders (because I don't see an elegant way of doing that without causing a cyclical dependency in reactivity)
  $: {
    if (draggable) {
      let draggablePos = $draggables.get(key) || origin.clone().add(direction.clone().multiplyScalar(length));  // TODO: fix undefined thingy here
      let v = draggablePos.clone().sub(origin);
      direction = v.clone().normalize();
      length = v.length();
    }
  }

  onMount(() => {
    if (draggable) {
      let pos = origin.clone().add(direction.clone().multiplyScalar(length));
      $draggables.set(key, pos);
    }
  });

  onDestroy(() => {
    $draggables.delete(key);
  });

  let endPoint = writable(origin.clone().add(direction.clone().multiplyScalar(length))); // store with tip of the vector

  $: coneHeight = hideHead ? 0 : CONE_HEIGHT;
  $: direction = direction.clone().normalize();

  setLabelPosition(endPoint);

  $: {
    endPoint.set(origin.clone().add(direction.clone().multiplyScalar(length)));
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
<Line start={origin} end={coneStart} {color} width={radius} {isDashed} />

{#if !hideHead}
  <Triangle points={[leftConePoint, $endPoint, rightConePoint]} {color} />
{/if}

<slot {endPoint} />
