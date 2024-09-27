<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Latex3D from '../Latex3D.svelte';
  import { Vector3 } from 'three';

  const { Story } = defineMeta({
    title: 'Threlte/Latex3D',
    component: Latex3D,
    argTypes: {
      latex: {
        description: 'The LaTeX string to render.',
        control: {
          type: 'text'
        }
      },
      fontSize: {
        description: 'The font size of the LaTeX rendering.',
        control: {
          type: 'number'
        }
      },
      position: {
        description: 'The position of the LaTeX in 3D space.',
        control: {
          type: 'object'
        }
      },
      offset: {
        description: 'The offset from the position.',
        control: {
          type: 'object'
        }
      },
      color: {
        description: 'The color of the LaTeX text.',
        control: {
          type: 'color'
        }
      },
      extend: {
        description: 'The extension distance from the position.',
        control: {
          type: 'number'
        }
      },
      hasBackground: {
        description: 'Whether to show a background behind the LaTeX.',
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
      <Latex3D {...args} />
      <Axis3D hideOrigin />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Latex3D component. -->
<Story
  name="Default"
  args={{
    latex: 'f(x) = x^2',
    fontSize: 1,
    position: new Vector3(0, 0, 0),
    offset: new Vector3(0, 0, 0),
    color: 'black',
    extend: 0,
    hasBackground: false
  }}
/>

<!-- This story demonstrates the Latex3D component with a larger font size and custom position. -->
<Story
  name="Large Font and Custom Position"
  args={{
    latex: '\\int_{0}^{\\infty} e^{-x} dx = 1',
    fontSize: 2,
    position: new Vector3(1, 1, 1),
    offset: new Vector3(0, 0, 0),
    color: 'black',
    extend: 0,
    hasBackground: false
  }}
/>

<!-- This story shows the Latex3D component with a colored background. -->
<Story
  name="With Background"
  args={{
    latex: 'f(x) = x^2',
    fontSize: 1.5,
    position: new Vector3(0, 0, 0),
    offset: new Vector3(0, 0, 0),
    extend: 0,
    hasBackground: true
  }}
/>

<!-- This story demonstrates the Latex3D component with custom color and offset. -->
<Story
  name="Custom Color and Offset"
  args={{
    latex: 'E = mc^2',
    fontSize: 1.2,
    position: new Vector3(0, 0, 0),
    offset: new Vector3(0.5, 0.5, 0.5),
    color: 'blue',
    extend: 0,
    hasBackground: false
  }}
/>
