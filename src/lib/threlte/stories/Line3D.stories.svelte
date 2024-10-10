<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Line3D from '../Line3D.svelte';
  import { Vector3 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const { Story } = defineMeta({
    title: 'Threlte/Line3D',
    component: Line3D,
    argTypes: {
      origin: {
        description: 'The starting point of the line.',
        control: {
          type: 'object'
        }
      },
      endPoint: {
        description: 'The ending point of the line.',
        control: {
          type: 'object'
        }
      },
      color: {
        description: 'The color of the line.',
        control: {
          type: 'color'
        }
      },
      isDashed: {
        description: 'Whether the line should be dashed.',
        control: {
          type: 'boolean'
        }
      },
      radius: {
        description: 'The radius of the line (thickness).',
        control: {
          type: 'number'
        }
      },
      alwaysOnTop: {
        description: 'Whether the line should always render on top.',
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
      <Line3D origin={new Vector3(-1, -1, -1)} endPoint={new Vector3(2, 0, 1)} {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Line3D component. -->
<Story
  name="Default"
  args={{
    origin: new Vector3(0, 0, 0),
    endPoint: new Vector3(2, 0, 1),
    color: PrimeColor.getRandomColor(),
    isDashed: false,
    alwaysOnTop: false
  }}
/>

<!-- This story demonstrates the Line3D component with a custom color and thickness. -->
<Story
  name="Custom Color and Thickness"
  args={{
    color: '#FF0000',
    isDashed: false,
    alwaysOnTop: false
  }}
/>

<!-- This story shows the Line3D component with dashed lines. -->
<Story
  name="Dashed Line"
  args={{
    color: '#FF0000',
    isDashed: true,
    alwaysOnTop: false
  }}
/>

<!-- This story demonstrates the Line3D component always rendering on top. -->
<Story
  name="Always on Top"
  args={{
    color: PrimeColor.darkGreen,
    isDashed: false,
    alwaysOnTop: true
  }}
/>
