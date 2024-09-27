<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Angle3D from '../Angle3D.svelte';
  import { Vector3 } from 'three';

  const { Story } = defineMeta({
    title: 'Threlte/Angle3D',
    component: Angle3D,
    argTypes: {
      vs: {
        description: 'The two vectors defining the angle.',
        control: {
          type: 'object'
        }
      },
      origin: {
        description: 'The origin point of the angle.',
        control: {
          type: 'object'
        }
      },
      size: {
        description: 'The size of the drawn angle.',
        control: {
          type: 'number'
        }
      },
      color: {
        description: 'The color of the angle.',
        control: {
          type: 'color'
        }
      },
      title: {
        description: 'The title or label for the angle.',
        control: {
          type: 'text'
        }
      },
      lineWidth: {
        description: 'The width of the lines.',
        control: {
          type: 'number'
        }
      },
      forceRightAngle: {
        description: 'Force a right angle representation.',
        control: {
          type: 'boolean'
        }
      },
      forceRoundAngle: {
        description: 'Force a round angle representation.',
        control: {
          type: 'boolean'
        }
      }
    }
  });
</script>

<script>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas3D from '../Canvas3D.svelte';
  import Axis3D from '../Axis3D.svelte';

  setTemplate(template);
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas3D>
      <Angle3D {...args} />
      <Axis3D hideOrigin hideTicks />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Angle3D component. It displays a black angle
  between two vectors in 3D space. -->
<Story
  name="Default"
  args={{
    vs: [new Vector3(1, 0, 0), new Vector3(0, 1, 0)],
    origin: new Vector3(0, 0, 0),
    size: 0.3,
    color: PrimeColor.black,
    title: 'θ',
    lineWidth: 1
  }}
/>

<!-- Colored Angle. This story demonstrates an angle with a custom color (raspberry). It shows how color
  can be used to distinguish different angles in a 3D space. -->
<Story
  name="Colored Angle"
  args={{
    vs: [new Vector3(1, 1, 0), new Vector3(-1, 1, 0)],
    origin: new Vector3(0, 0, 0),
    size: 0.5,
    color: PrimeColor.raspberry,
    title: 'α',
    lineWidth: 2
  }}
/>

<!-- Right Angle. This story illustrates a right angle (90 degrees) between two vectors. It demonstrates
  how the component represents perpendicular vectors. -->
<Story
  name="Right Angle"
  args={{
    vs: [new Vector3(1, 0, 0), new Vector3(0, 1, 0)],
    origin: new Vector3(0, 0, 0),
    size: 0.4,
    color: PrimeColor.blue,
    title: '90°',
    lineWidth: 1.5
  }}
/>

<!-- Forced Right Angle. This story shows a non-90-degree angle represented as a right angle using the
  forceRightAngle prop. -->
<Story
  name="Forced Right Angle"
  args={{
    vs: [new Vector3(1, 0, 0), new Vector3(1, 1, 0)],
    origin: new Vector3(0, 0, 0),
    size: 0.3,
    color: PrimeColor.orange,
    title: '45°',
    lineWidth: 1,
    forceRightAngle: true
  }}
/>

<!-- Forced Round Angle. This story demonstrates a 90-degree angle represented as a round angle using
  the forceRoundAngle prop. -->
<Story
  name="Forced Round Angle"
  args={{
    vs: [new Vector3(1, 0, 0), new Vector3(0, 1, 0)],
    origin: new Vector3(0, 0, 0),
    size: 0.5,
    color: PrimeColor.darkGreen,
    title: '90°',
    lineWidth: 2,
    forceRoundAngle: true
  }}
/>

<!-- Custom Origin. This story shows an angle with a custom origin point, demonstrating how angles can
  be positioned anywhere in 3D space. -->
<Story
  name="Custom Origin"
  args={{
    vs: [new Vector3(1, 1, 0), new Vector3(-1, 2, 0)],
    origin: new Vector3(1, 1, 1),
    size: 0.4,
    color: PrimeColor.darkGreen,
    title: 'β',
    lineWidth: 1.5
  }}
/>
