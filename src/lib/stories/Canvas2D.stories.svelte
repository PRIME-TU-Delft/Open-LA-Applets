<script module>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Vector2 } from 'three';

  const { Story } = defineMeta({
    title: 'Initialize/Canvas2D',
    component: Canvas2D
  });
</script>

<script lang="ts">
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { onDestroy } from 'svelte';
  import type { CanvasProps } from '$lib/d3/CanvasType';

  onDestroy(() => {
    globalState.title = '';
  });
</script>

{#snippet template(args: Omit<CanvasProps, 'children'>)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D {...args}>
      <Vector2D direction={new Vector2(1, 2)} color={PrimeColor.blue} length={2} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="Default" {template} />

<!-- This canvas is zoomed out 2x by specifying cameraZoom=0.5 -->
<Story name="Zoom out" args={{ cameraZoom: 0.5 }} {template} />

<!-- This canvas is moved to x:3 and y:1 -->
<Story name="Camera position" args={{ cameraPosition: new Vector2(3, 1) }} {template} />

<!-- This canvas is smaller than the regular canvas. This can be useful in combination with `cameraZoom` -->
<Story name="Adjust tickLength" args={{ axis: { length: 5 } }} {template} />

<!-- This can be useful when you would like to show the applet at one specific location -->
<Story name="Toggle pan" args={{ enablePan: false }} {template} />

<!-- This can be useful when you would like to hide the axis numbers and put more attension to the applet.  -->
<Story name="Toggle Axis Numbers" args={{ axis: { showAxisNumbers: false } }} {template} />
