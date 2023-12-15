<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Vector from '../Vector.svelte';

  export const meta = {
    title: '2d components/Vector',
    component: Vector,
    tags: ['autodocs']
  } satisfies Meta<Vector>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Canvas from '../Canvas.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
</script>

<Template let:args>
  <Canvas height="20rem">
    <!-- See properties panel in the Vector docs to see which args are allowed  -->
    <Vector {...args} />
  </Canvas>
</Template>

<Story name="With color" source args={{ color: PrimeColor.red }} />
<Story name="With origin" source args={{ origin: new Vector2(1, 1) }} />
<Story name="With direction" source args={{ origin: new Vector2(1, 1) }} />
<Story name="With length" source args={{ length: 2 }} />
<Story name="With radius" source args={{ radius: 0.1 }} />
<Story name="Without Head" source args={{ hideHead: true }} />
<Story name="Is dashed" source args={{ isDashed: true }} />
