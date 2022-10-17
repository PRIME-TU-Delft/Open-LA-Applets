## Code sample

```js
import { Canvas3D, PlaneFromNormal, PlaneFromPoints } from 'visuals-3d';
import { Vector3 } from 'three';
```

```svelte
<Canvas3D>
  <PlaneFromNormal
    point="{new Vector3(0, 0, 0)}"
    normal="{new Vector3(1, -1, -1)}"
    color="{PrimeColor.red}"
  />

  <PlaneFromPoints
    points="{[new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]}"
    color="{PrimeColor.ultramarine}"
  />
</Canvas3D>
```
