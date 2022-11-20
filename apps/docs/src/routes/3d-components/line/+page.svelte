<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D, Line3D } from 'visuals-3d';
  import { Vector3 } from 'three';

  import Docs from './docs.md';
  import Code from './code.md';
  import { PrimeColor } from 'utils/PrimeColors';
</script>

<Story>
  <Canvas3D --height="100%" autoPlay={true}>
    <Line3D points={[new Vector3(0, -2, -2), new Vector3(0, 2, 2)]} color={PrimeColor.red} />

    <Axis3D hideNumbers />
  </Canvas3D>

  <div class="prose" slot="docs">
    <Docs />
  </div>

  <div class="prose" slot="code">
    <Code />
  </div>
</Story>
