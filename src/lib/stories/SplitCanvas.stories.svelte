<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Canvas2D from '../d3/Canvas2D.svelte';

  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';
  import type { CanvasProps } from '$lib/d3/CanvasType';

  const { Story } = defineMeta({
    title: 'Initialize/SplitCanvas2D',
    component: Canvas2D,
    render: template
  });
</script>

{#snippet template(args: Omit<CanvasProps, 'children'>)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {...args}>
      <Vector2D direction={new Vector2(1, 2)} length={2} color={PrimeColor.blue} />

      {#snippet splitCanvas2DChildren()}
        <Vector2D direction={new Vector2(2, 1)} length={2} color={PrimeColor.raspberry} />
      {/snippet}
    </Canvas2D>
  </div>
{/snippet}

<!-- 
See [here](./?path=/docs/initialize-canvas2d--docs) for more information about the `Canvas2D` props.

The following props are available for `splitCanvas2DProps`:
- cameraPosition?: `Vector2`;
- cameraZoom?: `number`
- tickLength?: `number`
- showAxisNumbers?: `boolean`
- enablePan?: `boolean`
- draggables?: `Draggable[]`
-->
<Story name="Default" />

<!-- 
See [here](./?path=/docs/initialize-canvas3d--docs) for more information about the `Canvas3D` props.

The following props are available for `splitCanvas3DProps`:
- cameraPosition?: `Vector3`
- enablePan?: `boolean`
- cameraZoom?: `number`
-->
<Story name="With 3D on the right">
  {#snippet template(args)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D title="This is a split screen applet">
      <Vector2D direction={new Vector2(1, 2)} length={2} color={PrimeColor.blue} />

      {#snippet splitCanvas3DChildren()}
        <Vector3D direction={new Vector3(2, 1, 0)} length={2} color={PrimeColor.raspberry} />
        <Axis3D />
      {/snippet}
    </Canvas2D>
  </div>
  {/snippet}
</Story>

<!-- The same can be done with 3D on the left and 2D on the right. 
 A similar approach is available for two 3D applets next to one another. By replacing this snippet:

 ```html
{#snippet splitCanvas2DChildren()}
   <Vector2D direction={new Vector2(1, 2)} length={2} color={PrimeColor.blue} />
{/snippet}
 ```
  with a snippet like this:
  
  ```html
{#snippet splitCanvas3DChildren()}
  <Vector3D direction={new Vector3(1, 2, 0)} length={2} color={PrimeColor.blue} />
{/snippet}
```
 -->
<Story name="With 3D on the left">
  {#snippet template(args)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D title="This is a split screen applet">
      <Vector3D direction={new Vector3(2, 1, 0)} length={2} color={PrimeColor.raspberry} />
      <Axis3D />

      {#snippet splitCanvas2DChildren()}
        <Vector2D direction={new Vector2(1, 2)} length={2} color={PrimeColor.blue} />
      {/snippet}
    </Canvas3D>
  </div>
  {/snippet}
</Story>
