<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Histogram2D, { type Histogram2DProps } from '../Histogram2D.svelte';

  const { Story } = defineMeta({
    title: '2D Components/Histogram2D',
    component: Histogram2D,
    parameters: {
      docs: {
        description: {
          component: 'Histogram2D renders a histogram based on the given frequency map.'
        }
      }
    }
  });
</script>

<script lang="ts">
  import Canvas2D from '../Canvas2D.svelte';
  import { randomNormal } from 'd3';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  function getFreqMap(size: number, sigma?: number) {
    const fn = randomNormal(0, sigma ?? 1);

    const freqMap: { [x: number]: number } = {};

    for (let i = 0; i < size; i++) {
      const x = Math.floor(fn());

      if (freqMap[x]) {
        freqMap[x]++;
      } else {
        freqMap[x] = 1;
      }
    }

    return freqMap;
  }
</script>

{#snippet template(args: Histogram2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D scaleY={5}>
      <Histogram2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- This story showcases the default behaviour. The height of each bar is equal to its frequency. -->
<Story name="Default" args={{ freqMap: getFreqMap(50, 4), color: PrimeColor.blue }}>
  {#snippet template(args: Histogram2DProps)}
    <div class="h-[300px] overflow-hidden rounded-lg">
      <Canvas2D scaleY={1 / 5}>
        <Histogram2D {...args} />
      </Canvas2D>
    </div>
  {/snippet}
</Story>

<!-- This story showcases the histogram with normalized heights. The total area of the histogram is equal to 1. -->
<Story
  name="Normalized"
  args={{ freqMap: getFreqMap(200), normalized: true, color: PrimeColor.blue }}
  {template}
/>

<!-- This story showcases using lines instead of bins, similiar to a discrete probability function. -->
<Story
  name="With lines"
  args={{ freqMap: getFreqMap(200), normalized: true, isInteger: true, color: PrimeColor.blue }}
  {template}
/>

<!-- This story shows how the bins are offsetted by 0.5 in order to center them on the integers. -->
<Story
  name="Offsetted"
  args={{ freqMap: getFreqMap(200), normalized: true, xOffset: 0.5, color: PrimeColor.blue }}
  {template}
/>
