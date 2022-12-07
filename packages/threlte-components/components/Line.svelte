<script lang="ts">
  import { T } from '@threlte/core';
  import { BufferGeometry, Vector3 } from 'three';

  import getRandomColor from 'utils/PrimeColors';

  export let color : string = getRandomColor();
  export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];
  export let isDashed: boolean = false;

  $: geometry = new BufferGeometry().setFromPoints(points);

</script>

<T.Line {geometry}>
  {#if !isDashed}
    <T.LineBasicMaterial {color} />
  {:else}
    <T.LineDashedMaterial 
      {color} 
      dashSize={ 0.1}
      gapSize= {0.1}
      opacity={ 0.5}
      transparent={ true}
    />
  {/if}
</T.Line>
