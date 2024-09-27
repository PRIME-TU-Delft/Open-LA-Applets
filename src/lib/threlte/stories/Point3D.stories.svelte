<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Point3D from '../Point3D.svelte';
  import { Vector3 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const { Story } = defineMeta({
    title: 'Threlte/Point3D',
    component: Point3D,
    argTypes: {
      position: {
        description: 'The position of the point in 3D space.',
        control: {
          type: 'object'
        }
      },
      color: {
        description: 'The color of the point.',
        control: {
          type: 'color'
        }
      },
      size: {
        description: 'The size of the point.',
        control: {
          type: 'number'
        }
      },
      alwaysOnTop: {
        description: 'Whether the point should always render on top.',
        control: {
          type: 'boolean'
        }
      }
    }
  });
</script>

<script>
  import Canvas3D from '../Canvas3D.svelte';
  import Axis3D from '../Axis3D.svelte';

  setTemplate(template);
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas3D>
      <Point3D {...args} />
      <Axis3D hideOrigin hideTicks />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Point3D component. -->
<Story
  name="Default"
  args={{
    position: new Vector3(0, 0, 0),
    color: PrimeColor.darkGreen,
    size: 0.125
  }}
/>

<!-- This story demonstrates a Point3D with a custom position and color. -->
<Story
  name="Custom Position and Color"
  args={{
    position: new Vector3(1, 0, 1),
    color: PrimeColor.raspberry,
    size: 0.125
  }}
/>

<!-- This story shows a larger Point3D. -->
<Story
  name="Large Point"
  args={{
    position: new Vector3(0, 1, 0),
    color: PrimeColor.blue,
    size: 0.25
  }}
/>

<!-- This story demonstrates a Point3D that is not always on top. -->
<Story
  name="Not Always on Top"
  args={{
    position: new Vector3(-1, 0, 1),
    color: PrimeColor.orange,
    size: 0.125,
    alwaysOnTop: true
  }}
/>
