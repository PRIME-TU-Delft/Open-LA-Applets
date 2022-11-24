<script lang="ts">
  import { onMount, afterUpdate, getContext } from 'svelte';

  import { BufferGeometry, Color, Line, LineBasicMaterial, LineDashedMaterial, LineSegments, Vector3 } from 'three';

  import getRandomColor from 'ui/utils/primeColors';
  import { sceneKey, type SceneContext } from '../utils/sceneKey';

  export let color: string = getRandomColor();
  export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];

  // Import scene from root Canvas.svelte. Context is used because store is too global.
  // More info: https://svelte.dev/docs#run-time-svelte-setcontext
  const { scene } = getContext<SceneContext>(sceneKey);

  let line: LineSegments;

  const geometry = new BufferGeometry().setFromPoints(points);
  const material =
      new LineDashedMaterial({
                  color: color,
                  dashSize: 0.1,
                  gapSize: 0.1,
                  opacity: 0.5,
                  transparent: true
          });

  /**
   * Init the vector
   */
  onMount(() => {
    material.color.set(color);

    line = new LineSegments(geometry ,  material);
    line.computeLineDistances();
    scene.add(line);
    
    return () => {
      scene.remove(line);
    };
  });

  /**
   * When points are changed, update geometry & material color.
   */
  afterUpdate(() => {
    // Reset geometry
    geometry.setFromPoints(points);

    // Check if color is a valid css color accepts: [#fff, #f0f0f0, rgb(255, 255, 255), rgba(255, 255, 255, 1)] | rejects: [random, #rgba]
    if (!CSS.supports('color', color)) return;

    const newColor = new Color(color);

    // Check if color is updated
    if (!newColor.equals(material.color)) {
      material.color.set(newColor);
    }
  });
</script>
