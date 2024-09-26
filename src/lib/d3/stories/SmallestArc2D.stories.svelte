<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import SmallestArc2D from '../SmallestArc2D.svelte';
  import { Vector2 } from 'three';
  import Latex2D from '../Latex2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/SmallestArc2D',
    component: SmallestArc2D,
    argTypes: {
      points: {
        description: 'The two vectors that define the arc. Required.',
        control: {
          type: 'object'
        }
      },
      distance: {
        description: 'The distance of the arc from the origin.',
        control: {
          type: 'number'
        }
      },
      color: {
        description: 'The color of the arc.',
        control: {
          type: 'color'
        }
      },
      width: {
        description: 'The width of the arc line.',
        control: {
          type: 'number'
        }
      },
      hasHead: {
        description: 'Whether to draw an arrow at the end of the arc.',
        control: {
          type: 'boolean'
        }
      }
    }
  });
</script>

<script>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '../Canvas2D.svelte';

  setTemplate(template);
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas2D>
      <SmallestArc2D {...args}>
        {#snippet label(position)}
          <Latex2D latex={'\\varphi'} {position} extend={0.3} color={PrimeColor.black} />
        {/snippet}
      </SmallestArc2D>
    </Canvas2D>
  </div>
{/snippet}

<!-- Default -->
<Story
  name="Default"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 1.5,
    color: PrimeColor.black,
    width: 0.02,
    hasHead: false
  }}
/>

<!-- With different vectors -->
<Story
  name="With different vectors"
  args={{
    points: [new Vector2(1, 1), new Vector2(-1, 1)],
    distance: 1.5,
    color: PrimeColor.raspberry
  }}
/>

<!-- With larger distance -->
<Story
  name="With larger distance"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 2.5,
    color: PrimeColor.blue,
    lineWidth: 0.02
  }}
/>

<!-- With thicker line -->
<Story
  name="With thicker line"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 1.5,
    color: PrimeColor.darkGreen,
    width: 0.05
  }}
/>

<!-- With custom arrow defined -->
<Story
  name="With custom arrow defined"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)],
    distance: 1.5,
    color: PrimeColor.darkGreen,
    hasHead: true
  }}
/>
