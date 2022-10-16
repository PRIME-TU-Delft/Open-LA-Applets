<script lang="ts">
  import { Story } from 'ui';
  import { Axis3D, Canvas3D, PlaneFromNormal, PlaneFromPoints } from 'visuals-3d';
  import { PrimeColor } from 'ui/utils/primeColors';
  import { Vector3 } from 'three';

  import Docs from './docs.md';
  import Code from './code.md';
</script>

<Story>
  <Canvas3D --height="100%" autoPlay="{true}">
    <PlaneFromNormal
      point="{new Vector3(0, 0, 0)}"
      normal="{new Vector3(1, -1, -1)}"
      color="{PrimeColor.red}"
    />

    <PlaneFromPoints
      points="{[new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]}"
      color="{PrimeColor.ultramarine}"
    />

    <Axis3D hideNumbers />
  </Canvas3D>

  <div class="prose" slot="docs">
    <Docs />
  </div>

  <div class="prose" slot="code">
    <Code />
  </div>
</Story>
