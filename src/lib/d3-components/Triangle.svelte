<script lang="ts">
  import { Vector2 } from 'three';

  export let points: [Vector2, Vector2, Vector2] = [new Vector2(), new Vector2(), new Vector2()];
  export let color: string = 'black';
</script>

<polygon points={points.map((p) => p.x + ',' + p.y).join(' ')} fill={color} />
