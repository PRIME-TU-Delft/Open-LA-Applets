<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Arc from '../Arc.svelte';

  export const meta = {
    title: '2d components/Arc',
    component: Arc,
    tags: ['autodocs']
  } satisfies Meta<Arc>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Canvas from '../Canvas.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
</script>

<Template let:args>
  <Canvas height="20rem">
    <!-- See properties panel in the Arc docs to see which args are allowed  -->
    <Arc {...args} />
  </Canvas>
</Template>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" source args={{ color: PrimeColor.red }} />

<Story
  name="With points defined"
  source
  args={{ points: [new Vector2(1, 1), new Vector2(-1, -1)] }}
/>
<Story name="With origin defined" source args={{ origin: new Vector2(1, 1) }} />
<Story name="With width defined" source args={{ width: 0.1 }} />
<Story name="With distance defined" source args={{ distance: 1 }} />
