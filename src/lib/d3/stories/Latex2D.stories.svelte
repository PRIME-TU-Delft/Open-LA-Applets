<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Latex2D from '../Latex2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Latex2D',
    component: Latex2D,
    argTypes: {
      latex: {
        description: 'The LaTeX content to render. Required.',
        control: {
          type: 'text'
        }
      },
      fontSize: {
        description: 'The font size of the LaTeX text.',
        control: {
          type: 'number'
        }
      },
      position: {
        description: 'The position of the LaTeX text.',
        control: {
          type: 'object'
        }
      },
      offset: {
        description: 'The offset of the LaTeX text.',
        control: {
          type: 'object'
        }
      },
      extend: {
        description: 'The extend value for the LaTeX text.',
        control: {
          type: 'number'
        }
      },
      color: {
        description: 'The color of the LaTeX text.',
        control: {
          type: 'color'
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
      <Latex2D latex="E=mc^2" {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<!-- A LaTeX text with different content defined -->
<Story name="With content defined" source args={{ latex: 'a^2 + b^2 = c^2' }} />

<Story name="With font size defined" source args={{ fontSize: 4 }} />

<Story name="With position defined" source args={{ position: new Vector2(1, 1) }} />

<Story name="With offset defined" source args={{ offset: new Vector2(0.5, 0.5) }} />

<Story name="With extend defined" source args={{ extend: 2 }} />
