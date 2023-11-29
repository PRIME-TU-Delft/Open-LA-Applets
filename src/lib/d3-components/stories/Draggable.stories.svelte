<script lang="ts" context="module">
  import type { Meta } from '@storybook/svelte';
  import Draggable from '../Draggable.svelte';

  export const meta = {
    title: '2d components/Draggable',
    component: Draggable,
    tags: ['autodocs'],
    parameters: docsForStory(
      'Draggable is a component that allows you to drag a point around the canvas'
    )
  } satisfies Meta<Draggable>;
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Canvas from '../Canvas.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import docsForStory from '$lib/utils/docsForStory';
  import { Vector2 } from 'three';
</script>

<Template let:args>
  <Canvas height="20rem">
    <!-- See properties panel in the Draggable docs to see which args are allowed  -->
    <Draggable {...args} />
  </Canvas>
</Template>

<Story name="Default" source />

<Story
  name="Make sure each draggable has a unique id"
  parameters={docsForStory(
    `> ⚠️ What ever you do, do not forget the add the ids

     When draggables do not have a unique id, they will not have the correct (re-)start position.`
  )}
  source
  let:args
>
  <Canvas height="20rem" {...args} title="Left is wrong, Right is good">
    <!-- THESE are WRONG because they do not have ids -->
    <Draggable {...args} position={new Vector2(1, 2)} color={PrimeColor.green} />
    <Draggable {...args} position={new Vector2(2, 1)} color={PrimeColor.red} />

    <svelte:fragment slot="splitCanvas">
      <!-- THESE are correct because they have unique ids -->
      <Draggable {...args} position={new Vector2(1, 2)} color={PrimeColor.green} id="a" />
      <Draggable {...args} position={new Vector2(2, 1)} color={PrimeColor.red} id="b" />
    </svelte:fragment>
  </Canvas>
</Story>

<Story name="With color" source args={{ color: PrimeColor.green, id: 'color' }} />

<Story name="With position" source args={{ position: new Vector2(1, 2), id: 'position' }} />
