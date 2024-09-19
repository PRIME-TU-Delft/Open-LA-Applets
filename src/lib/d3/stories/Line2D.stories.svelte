<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Line2D from '../Line2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Line2D',
    component: Line2D,
    argTypes: {
      start: {
        description: 'The start of the line. Required.',
        control: {
          type: 'object'
        }
      },
      end: {
        description: 'The end of the line. Required.',
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
      width: {
        description: 'The width of the line.',
        control: {
          type: 'number'
        }
      },
      isDashed: {
        description: 'Whether the line is dashed or not.',
        control: {
          type: 'boolean'
        }
      }
    }
  });
</script>

<script>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';

  setTemplate(template);
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas2D>
      <Line2D start={new Vector2(0, 0)} end={new Vector2(1, 1)} {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<!-- A Line with different start and end points defined -->
<Story
  name="With start and end points defined"
  source
  args={{ start: new Vector2(1, 1), end: new Vector2(-1, -1) }}
/>

<Story name="With width defined" source args={{ width: 0.1 }} />

<Story name="With dashed line" source args={{ isDashed: true }} />
