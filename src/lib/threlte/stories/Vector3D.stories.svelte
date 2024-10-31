<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Vector3D from '../Vector3D.svelte';
  import { Vector3 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const { Story } = defineMeta({
    title: 'Threlte/Vector3D',
    component: Vector3D,
    argTypes: {
      color: {
        description: 'The color of the vector.',
        control: {
          type: 'color'
        }
      },
      origin: {
        description: 'The origin point of the vector.',
        control: {
          type: 'object'
        }
      },
      direction: {
        description: 'The direction of the vector.',
        control: {
          type: 'object'
        }
      },
      isDashed: {
        description: 'Whether the vector line should be dashed.',
        control: {
          type: 'boolean'
        }
      },
      length: {
        description: 'The length of the vector (optional).',
        control: {
          type: 'number'
        }
      },
      radius: {
        description: 'The radius (thickness) of the vector line.',
        control: {
          type: 'number'
        }
      },
      hideHead: {
        description: 'Whether to hide the arrowhead of the vector.',
        control: {
          type: 'boolean'
        }
      },
      alwaysOnTop: {
        description: 'Whether the vector should always render on top.',
        control: {
          type: 'boolean'
        }
      },
      noNormalise: {
        description: 'Whether to skip normalizing the direction vector.',
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

{#snippet template(args: Args<Story>)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas3D>
      <Vector3D {...args} />
      <Axis3D hideOrigin hideTicks />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Vector3D component. -->
<Story
  name="Default"
  args={{
    color: PrimeColor.darkGreen,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(1, 1, 0),
    length: 1
  }}
/>

<!-- This story demonstrates a Vector3D with a custom origin and direction. -->
<Story
  name="Custom Origin and Direction"
  args={{
    color: PrimeColor.raspberry,
    origin: new Vector3(-1, -1, -1),
    direction: new Vector3(2, 2, 2)
  }}
/>

<!-- This story shows a dashed Vector3D. -->
<Story
  name="Dashed Vector"
  args={{
    color: PrimeColor.blue,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(0, 5, 0),
    isDashed: true,
    length: 5
  }}
/>

<!-- This story demonstrates a Vector3D with a specified length. -->
<Story
  name="Specified Length"
  args={{
    color: PrimeColor.orange,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(1, 1, 0),
    length: 2
  }}
/>

<!-- This story shows a Vector3D without an arrowhead. -->
<Story
  name="No Arrowhead"
  args={{
    color: PrimeColor.darkGreen,
    origin: new Vector3(0, 0, 0),
    direction: new Vector3(1, 0, 1),
    hideHead: true
  }}
/>
