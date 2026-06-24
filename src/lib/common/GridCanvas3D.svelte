<script lang="ts" module>
  import type { Camera3DProps } from '$lib/threlte/Camera3D.svelte';
  import type { Snippet } from 'svelte';

  export type GridCanvas3DProps = Camera3DProps & {
    gridColumn?: string;
    gridRow?: string;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { Canvas as CanvasThrelte } from '@threlte/core';
  import Camera3D from '$lib/threlte/Camera3D.svelte';
  import { NoToneMapping } from 'three';
  import { activityState } from '$lib/stores/activity.svelte';

  let {
    gridColumn = 'auto',
    gridRow = 'auto',
    children,
    ...cameraProps
  }: GridCanvas3DProps = $props();

  const renderMode = $derived(activityState.isActive ? 'on-demand' : 'manual');
</script>

<div
  style="grid-column: {gridColumn}; grid-row: {gridRow}; overflow: hidden; border-width: 2px"
  class="border-blue-500"
>
  <CanvasThrelte {renderMode} toneMapping={NoToneMapping}>
    <Camera3D {...cameraProps} />
    {#if children}
      {@render children()}
    {/if}
  </CanvasThrelte>
</div>
