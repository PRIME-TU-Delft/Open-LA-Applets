<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Parallelogram2D from '../Parallelogram2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Parallelogram2D',
    component: Parallelogram2D,
    argTypes: {
      points: {
        description: 'The three vectors that define the parallelogram. Required.',
        control: {
          type: 'object'
        }
      },
      color: {
        description: 'The color of the parallelogram.',
        control: {
          type: 'color'
        }
      },
      strokeWidth: {
        description: 'The width of the stroke.',
        control: {
          type: 'number'
        }
      },
      opacity: {
        description: 'The opacity of the parallelogram.',
        control: {
          type: 'number'
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
      <Parallelogram2D
        points={[new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]}
        {...args}
      />
    </Canvas2D>
  </div>
{/snippet}

<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<!-- A Parallelogram with different points defined -->
<Story
  name="With other points defined"
  source
  args={{ points: [new Vector2(1, 1), new Vector2(3, 2), new Vector2(1, 2)] }}
/>

<Story name="With opacity defined" source args={{ opacity: 0.5 }} />

<Story
  name="Without stroke width defined"
  source
  args={{ color: PrimeColor.raspberry, strokeWidth: 0 }}
/>
