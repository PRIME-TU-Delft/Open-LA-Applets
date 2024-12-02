<script module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import InfiniteLine2D from '../InfiniteLine2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/InfiniteLine2D',
    component: InfiniteLine2D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';
  import type { InfiniteLine2DProps } from '../InfiniteLine2D.svelte';

  setTemplate(template);
</script>

{#snippet template(args: InfiniteLine2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <InfiniteLine2D direction={new Vector2(1, 1)} {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" args={{ color: PrimeColor.raspberry }} />

<!-- An InfiniteLine with different origin defined -->
<Story name="With origin defined" args={{ origin: new Vector2(0, 1) }} />

<Story name="With width defined" args={{ width: 0.1 }} />

<Story name="With dashed line" args={{ isDashed: true }} />
