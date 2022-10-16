<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D, Point3D } from 'visuals-3d';
  import { Vector3 } from 'three';
  import { Label } from 'visuals-3d/utils/label';

  import Docs from './docs.md';
  import Code from './code.md';

  function randomNum(from = -5, to = 5) {
    const range = to - from;

    return Math.random() * range + from;
  }

  // 20 random points between -5 and 5 in every direction
  const points = new Array(20)
    .fill(0)
    .map(() => new Vector3(randomNum(), randomNum(), randomNum()));
</script>

<Story>
  <Canvas3D --height="100%" autoPlay="{true}">
    {#each points as point}
      <Point3D
        position="{point}"
        label="{new Label(
          point.x.toFixed(2) + ' ' + point.y.toFixed(2) + ' ' + point.z.toFixed(2),
          '#000',
          1
        )}"
      />
    {/each}
    <Axis3D />
  </Canvas3D>

  <div class="prose" slot="docs">
    <Docs />
  </div>

  <div class="prose" slot="code">
    <Code />
  </div>
</Story>
