<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Span3D from '../Span3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Span3D',
    component: Span3D,
    parameters: {
      docs: {
        description: {
          component:
            'This component shows the span of vectors in 3D space (the whole space, plane, line or origin point). The *toggles* variables change whether that vector should be used.'
        }
      }
    }
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '../Canvas3D.svelte';
  import { Vector3 } from 'three';
  import { type CubePlaneLineProps } from '../Span3D.svelte';
  import Axis3D from '../Axis3D.svelte';
</script>

{#snippet template(args: CubePlaneLineProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Span3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- Span of 3 vectors: e1, e2, e3 -->
<Story
  name="Default"
  args={{
    toggles: [true, true, true],
    vectors: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]
  }}
  {template}
/>

<!-- Span of 3 vectors: e1, e2, e3, shown with a smaller cube -->
<Story
  name="Small cube"
  args={{
    toggles: [true, true, true],
    vectors: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)],
    cubeSize: 5
  }}
  {template}
/>

<!-- Span of 2 vectors: e1, e3 -->
<Story
  name="Plane"
  args={{
    toggles: [true, false, true],
    vectors: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]
  }}
  {template}
/>

<!-- Span of 1 vector: e1 -->
<Story
  name="Line"
  args={{
    toggles: [true, false, false],
    vectors: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]
  }}
  {template}
/>

<!-- Span of 0 vectors -->
<Story
  name="Origin point"
  args={{
    toggles: [false, false, false],
    vectors: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]
  }}
  {template}
/>

<!-- Span of 0 vectors with moved origin -->
<Story
  name="Moved origin"
  args={{
    origin: new Vector3(3, 1, 1),
    toggles: [false, false, false],
    vectors: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]
  }}
  {template}
/>

<!-- Span of 3 vectors: e1, e2, e3, with color specified -->
<Story
  name="Color"
  args={{
    color: PrimeColor.darkGreen,
    toggles: [true, true, true],
    vectors: [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]
  }}
  {template}
/>
