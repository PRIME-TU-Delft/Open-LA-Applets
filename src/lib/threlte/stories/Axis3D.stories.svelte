<script module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Axis3D from '../Axis3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Axis3D',
    component: Axis3D
  });
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Axis3DProps } from '../Axis3D.svelte';
  import Canvas3D from '../Canvas3D.svelte';

  setTemplate(template as Snippet<[Partial<Axis3DProps>]>);
</script>

{#snippet template(args: Axis3DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas3D>
      <Axis3D {...args} />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Axis3D component. -->
<Story
  name="Default"
  args={{
    showNumbers: false,
    hideTicks: false,
    axisLength: 10,
    axisSpacing: 2,
    floor: false,
    hideOrigin: false
  }}
/>

<!-- This story demonstrates the Axis3D component with numbers shown on the axis. -->
<Story
  name="With Numbers"
  args={{
    showNumbers: true,
    hideTicks: false,
    axisLength: 10,
    axisSpacing: 2,
    floor: false,
    hideOrigin: false
  }}
/>

<!-- This story shows the Axis3D component with custom axis length and spacing. -->
<Story
  name="Custom Length and Spacing"
  args={{
    showNumbers: true,
    hideTicks: false,
    axisLength: 15,
    axisSpacing: 3,
    floor: false,
    hideOrigin: false
  }}
/>

<!-- This story demonstrates the Axis3D component with a floor plane. -->
<Story
  name="With Floor"
  args={{
    showNumbers: false,
    hideTicks: false,
    axisLength: 10,
    axisSpacing: 2,
    floor: true,
    hideOrigin: false
  }}
/>

<!-- This story demonstrates the Axis3D component with hidden ticks and origin. -->
<Story
  name="Hidden Ticks and Origin"
  args={{
    showNumbers: true,
    hideTicks: true,
    axisLength: 10,
    axisSpacing: 2,
    floor: false,
    hideOrigin: true
  }}
/>
