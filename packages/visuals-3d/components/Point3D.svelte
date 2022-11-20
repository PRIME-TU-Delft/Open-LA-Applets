<script lang="ts">
  /***
   * This Compoenent is a 3d Point with an optional label
   * */

  import { getContext, onMount, beforeUpdate, onDestroy } from 'svelte';
  import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

  import getRandomColor from 'utils/PrimeColors';
  import { changeColor } from 'utils/ChangeAttributes';
  import { Label } from 'utils/Label';
  import { sceneKey, type SceneContext } from 'utils/SceneKey';

  import Label3D from './Label3D.svelte';

  export let position: Vector3 = new Vector3(0, 0, 0); // position of the point and label
  export let color: string = getRandomColor(); // color of point and label
  export let size = 0.125; // Size of dot and label
  export let label = Label.default(); // label text

  // Import scene from root Canvas.svelte. Context is used because store is too global.
  // More info: https://svelte.dev/docs#run-time-svelte-setcontext
  const { scene } = getContext<SceneContext>(sceneKey);

  const geometry = new SphereGeometry(size, 32, 16);
  const material = new MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
  let point: Mesh;

  onMount(() => {
    point = new Mesh(geometry, material);
    point.position.copy(position);

    scene.add(point);
  });

  beforeUpdate(() => {
    if (!point) return;

    // Change the position of the point.
    point.position.set(position.x, position.y, position.z);

    // Change the color of the point.
    changeColor(material, color);
  });

  onDestroy(() => {
    scene.remove(point);
  });
</script>

{#if label.title}
  <Label3D size={label.size} position={position.clone()}>
    {label.title}
  </Label3D>
{/if}
