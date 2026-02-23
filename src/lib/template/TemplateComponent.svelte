<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { Vector2 } from 'three';
  import { AsymptoteFragment, FunctionFragment, type AppletObject } from './TemplateAppletObjects';

  let { objects }: { objects: AppletObject[] } = $props();
</script>

<Canvas2D>
  {#each objects as object, idx (idx)}
    {#if object instanceof FunctionFragment}
      <ExplicitFunction2D
        func={object.func}
        color={object.color.toString()}
        xMin={object.domain?.xMin}
        xMax={object.domain?.xMax}
        integral={object.integral}
      />

      {#each object.gaps as position, idx (idx)}
        <Circle2D {position} fill="white" color={object.color.toString()} radius={0.075} />
      {/each}
      {#each object.includedPoints as position, idx (idx)}
        <Circle2D
          {position}
          fill={object.color.toString()}
          color={object.color.toString()}
          radius={0.075}
        />
      {/each}
    {:else if object instanceof AsymptoteFragment}
      {#if object.type == 'vertical'}
        <InfiniteLine2D
          color={object.color.toString()}
          origin={new Vector2(object.position, 0)}
          direction={new Vector2(0, 1)}
          isDashed={true}
        />
      {:else}
        <InfiniteLine2D
          color={object.color.toString()}
          origin={new Vector2(0, object.position)}
          direction={new Vector2(1, 0)}
          isDashed={true}
        />
      {/if}
    {/if}
  {/each}
</Canvas2D>
