<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D, Vector3D } from 'visuals-3d';
  import { Vector3 } from 'three';

  import Docs from './docs.md';
  import Code from './code.md';
</script>

<Story>
  <Canvas3D --height="100%" autoPlay={true}>
    <Vector3D direction={new Vector3(1, 1, -1)} length={2} />

    <Axis3D />
  </Canvas3D>

  <div class="prose" slot="docs">
    <Docs />
  </div>

  <div class="prose" slot="code">
    <Code />
  </div>
</Story>
