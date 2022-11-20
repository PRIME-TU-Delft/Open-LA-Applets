<script lang="ts">
  import { T } from '@threlte/core';
  import { BufferGeometry, Vector3 } from 'three';

  import getRandomColor from 'utils/PrimeColors';

  export let color = getRandomColor();
  export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];

  $: geometry = new BufferGeometry().setFromPoints(points);
</script>

<T.Line {geometry}>
  <T.LineBasicMaterial {color} />
</T.Line>
