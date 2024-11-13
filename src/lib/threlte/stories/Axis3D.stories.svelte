<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Axis3D from '../Axis3D.svelte';

  const { Story } = defineMeta({
    title: 'Threlte/Axis3D',
    component: Axis3D,
    argTypes: {
      showNumbers: {
        description: 'Whether to show numbers on the axis.',
        control: {
          type: 'boolean'
        }
      },
      hideTicks: {
        description: 'Whether to hide tick marks on the axis.',
        control: {
          type: 'boolean'
        }
      },
      axisLength: {
        description: 'The length of each axis.',
        control: {
          type: 'number'
        }
      },
      axisSpacing: {
        description: 'The spacing between tick marks.',
        control: {
          type: 'number'
        }
      },
      floor: {
        description: 'Whether to show a floor plane.',
        control: {
          type: 'boolean'
        }
      },
      hideOrigin: {
        description: 'Whether to hide the origin label.',
        control: {
          type: 'boolean'
        }
      }
    }
  });
</script>

<script>
  import Canvas3D from '../Canvas3D.svelte';

  setTemplate(template);
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas3D>
      <Axis3D {...args} />
    </Canvas3D>
  </div>
{/snippet}

<!-- This story showcases the default appearance of the Axis3D component. -->
<Story
  name="Default"
  args={{
    showNumbers: false,
    hideTicks: false,
    axisLength: 10,
    axisSpacing: 2,
    floor: false,
    hideOrigin: false
  }}
/>

<!-- This story demonstrates the Axis3D component with numbers shown on the axis. -->
<Story
  name="With Numbers"
  args={{
    showNumbers: true,
    hideTicks: false,
    axisLength: 10,
    axisSpacing: 2,
    floor: false,
    hideOrigin: false
  }}
/>

<!-- This story shows the Axis3D component with custom axis length and spacing. -->
<Story
  name="Custom Length and Spacing"
  args={{
    showNumbers: true,
    hideTicks: false,
    axisLength: 15,
    axisSpacing: 3,
    floor: false,
    hideOrigin: false
  }}
/>

<!-- This story demonstrates the Axis3D component with a floor plane. -->
<Story
  name="With Floor"
  args={{
    showNumbers: false,
    hideTicks: false,
    axisLength: 10,
    axisSpacing: 2,
    floor: true,
    hideOrigin: false
  }}
/>

<!-- This story demonstrates the Axis3D component with hidden ticks and origin. -->
<Story
  name="Hidden Ticks and Origin"
  args={{
    showNumbers: true,
    hideTicks: true,
    axisLength: 10,
    axisSpacing: 2,
    floor: false,
    hideOrigin: true
  }}
/>
