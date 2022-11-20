<script lang="ts">
  import { onMount, onDestroy, beforeUpdate, getContext } from 'svelte';
  import { BoxGeometry, EdgesGeometry, LineDashedMaterial, LineSegments, Vector3 } from 'three';

  import { sceneKey, type SceneContext } from 'utils/SceneKey';

  export let end: Vector3 = new Vector3(1, 1, 1); // direction of vector

  // Import scene from root Canvas.svelte. Context is used because store is too global.
  // More info: https://svelte.dev/docs#run-time-svelte-setcontext
  const { scene } = getContext<SceneContext>(sceneKey);

  let line: LineSegments;
  const geometry = new BoxGeometry(end.x, end.y, end.z);
  const material = new LineDashedMaterial({
    color: 0xffffff,
    dashSize: 0.1,
    gapSize: 0.1,
    opacity: 0.5,
    transparent: true
  });
  const edges = new EdgesGeometry(geometry);

  onMount(() => {
    // TODO: Set label with deconstruction
    line = new LineSegments(edges, material);
    line.computeLineDistances();
    line.position.set(end.x / 2, end.y / 2, end.z / 2);
    scene.add(line);
  });

  beforeUpdate(() => {
    if (line && end.clone().multiplyScalar(0.5).equals(line.position) === false) {
      line = new LineSegments(edges, material);
      line.computeLineDistances();
      line.position.set(end.x / 2, end.y / 2, end.z / 2);
    }
  });

  onDestroy(() => {
    scene.remove(line);
  });
</script>
