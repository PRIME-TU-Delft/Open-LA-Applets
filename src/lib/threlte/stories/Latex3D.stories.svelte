<script module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import { Vector3 } from 'three';
  import Latex3D from '../Latex3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Latex3D',
    component: Latex3D
  });
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import Axis3D from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';
  import type { Latex3DProps } from '../Latex3D.svelte';

  setTemplate(template as Snippet<[Partial<Latex3DProps>]>);
</script>

{#snippet template(args: Latex3DProps)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas3D>
      <Latex3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Latex3D component. -->
<Story
  name="Default"
  args={{
    latex: 'f(x) = x^2',
    fontSize: 1,
    position: new Vector3(0, 0, 0),
    offset: new Vector3(0, 0, 0),
    color: 'black',
    extend: 0,
    hasBackground: false
  }}
/>

<!-- This story demonstrates the Latex3D component with a larger font size and custom position. -->
<Story
  name="Large Font and Custom Position"
  args={{
    latex: '\\int_{0}^{\\infty} e^{-x} dx = 1',
    fontSize: 2,
    position: new Vector3(1, 1, 1),
    offset: new Vector3(0, 0, 0),
    color: 'black',
    extend: 0,
    hasBackground: false
  }}
/>

<!-- This story shows the Latex3D component with a colored background. -->
<Story
  name="With Background"
  args={{
    latex: 'f(x) = x^2',
    fontSize: 1.5,
    position: new Vector3(0, 0, 0),
    offset: new Vector3(0, 0, 0),
    extend: 0,
    hasBackground: true
  }}
/>

<!-- This story demonstrates the Latex3D component with custom color and offset. -->
<Story
  name="Custom Color and Offset"
  args={{
    latex: 'E = mc^2',
    fontSize: 1.2,
    position: new Vector3(0, 0, 0),
    offset: new Vector3(0.5, 0.5, 0.5),
    color: 'blue',
    extend: 0,
    hasBackground: false
  }}
/>
