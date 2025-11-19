<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Cuboid3D from '../Cuboid3D.svelte';

  const { Story } = defineMeta({
    title: '3D Components/Cuboid3D',
    component: Cuboid3D
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import type { Cuboid3DProps } from '../Cuboid3D.svelte';
</script>

{#snippet template(args: Cuboid3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Cuboid3D {...args} />
  </div>
{/snippet}

<Story
  name="Default Cuboid"
  args={{
    corners: [new Vector3(0, 0, 0), new Vector3(1, 1, 1)]
  }}
  {template}
/>

<Story
  name="With custom color"
  args={{
    corners: [new Vector3(0, 0, 0), new Vector3(1, 1, 1)],
    color: PrimeColor.raspberry
  }}
  {template}
/>

<Story
  name="Without edges"
  args={{
    corners: [new Vector3(0, 0, 0), new Vector3(1, 1, 1)],
    toggleEdges: false
  }}
  {template}
/>

<Story
  name="Large Cuboid"
  args={{
    corners: [new Vector3(-2, -2, -2), new Vector3(2, 2, 2)],
    color: PrimeColor.blue
  }}
  {template}
/>
