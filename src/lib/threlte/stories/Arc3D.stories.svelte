<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Arc3D from '../Arc3D.svelte';
  import { Vector3 } from 'three';

  const { Story } = defineMeta({
    title: 'Threlte/Arc3D',
    component: Arc3D,
    argTypes: {
      points: {
        description: 'The two vectors defining the arc. Required.',
        control: {
          type: 'object'
        }
      },
      color: {
        description: 'The color of the arc.',
        control: {
          type: 'color'
        }
      },
      origin: {
        description: 'The origin point of the arc.',
        control: {
          type: 'object'
        }
      },
      pointsOnArc: {
        description: 'The number of points to use when drawing the arc.',
        control: {
          type: 'number'
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
      <Arc3D {...args} />
      <Axis3D hideOrigin hideTicks />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Arc3D component. It displays a black arc
  between two vectors in 3D space. -->
<Story
  name="Default"
  args={{
    points: [new Vector3(1, 0, 0), new Vector3(0, 1, 0)],
    color: PrimeColor.black,
    origin: new Vector3(0, 0, 0),
    pointsOnArc: 15
  }}
/>

<!-- Colored Arc. This story demonstrates an arc with a custom color (raspberry). It shows how color
  can be used to distinguish different arcs in a 3D space. -->
<Story
  name="Colored Arc"
  args={{
    points: [new Vector3(1, 1, 0), new Vector3(-1, 1, 0)],
    color: PrimeColor.raspberry,
    origin: new Vector3(0, 0, 0),
    pointsOnArc: 20
  }}
/>

<!-- Custom Origin. This story shows an arc with a custom origin point, demonstrating how arcs can
  be positioned anywhere in 3D space. -->
<Story
  name="Custom Origin"
  args={{
    points: [new Vector3(1, 1, 0), new Vector3(-1, 2, 0)],
    color: PrimeColor.darkGreen,
    origin: new Vector3(1, 1, 1),
    pointsOnArc: 25
  }}
/>

<!-- Custom Resolution. This story demonstrates an arc with a custom resolution, showcasing how the
  number of points used to draw the arc can affect its smoothness. -->
<Story
  name="Custom Resolution"
  args={{
    points: [new Vector3(1, 1, 0), new Vector3(-1, 2, 0)],
    color: PrimeColor.darkGreen,
    origin: new Vector3(0, 0, 0),
    pointsOnArc: 100
  }}
/>
