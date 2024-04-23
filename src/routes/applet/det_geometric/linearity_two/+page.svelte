<script>
  import { Canvas2D, Latex2D, Vector2D } from '$lib/d3-components';
  import Polygon from '$lib/d3-components/Polygon.svelte';
  import { Controls } from '$lib/utils/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let controls = Controls.addSlider(0, 0, 1, 0.1, PrimeColor.raspberry, 'Animation', () => '');

  // Primitives
  const o = new Vector2(0, 0);
  const u = new Vector2(4, 1);
  const v = new Vector2(1, 3);
  const w = new Vector2(2, -0.5);

  // Derived
  const vw = v.clone().add(w);
  const uv = u.clone().add(v);
  const uvw = u.clone().add(v).add(w);

  const OAFC = [o, u, uv, v]; // OABC static
</script>

<Canvas2D bind:controls showAxisNumbers={false}>
  <!-- Polygons -->
  <Polygon
    points={OAFC}
    color={PrimeColor.raspberry + PrimeColor.opacity(0.2)}
    strokeColor={PrimeColor.raspberry}
  />

  <!-- U, V, W, V +W -->
  <Vector2D direction={u} length={u.length()} color={PrimeColor.raspberry} />
  <Latex2D
    latex={String.raw`\mathbf{u}`}
    position={u.clone().multiplyScalar(0.5)}
    offset={new Vector2(0, -0.1)}
    color={PrimeColor.raspberry}
  />

  <Vector2D direction={v} length={v.length()} color={PrimeColor.raspberry} />
  <Latex2D
    latex={String.raw`\mathbf{v}`}
    position={v.clone().multiplyScalar(0.5)}
    offset={new Vector2(0, -0.1)}
    color={PrimeColor.raspberry}
  />

  <Vector2D direction={w} length={w.length()} color={PrimeColor.blue} />
  <Latex2D
    latex={String.raw`\mathbf{w}`}
    position={w.clone().multiplyScalar(0.5)}
    offset={new Vector2(0, -0.1)}
    color={PrimeColor.blue}
  />
</Canvas2D>
