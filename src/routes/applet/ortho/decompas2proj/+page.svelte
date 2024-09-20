<script>
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const u = new Vector3(2, 3, 2);
  const v1 = new Vector3(5, 0, 0);
  const v2 = new Vector3(0, 0, 5);
  const v3 = new Vector3(0, 5, 0);

  const proj_v1 = u.clone().projectOnVector(v1);
  const proj_v2 = u.clone().projectOnVector(v2);
  const proj_v3 = u.clone().projectOnVector(v3);
</script>

<Canvas3D cameraPosition={new Vector3(3.24, 10.17, 19.37)} cameraZoom={50}>
  <!-- MARK: V1 & V2 -->
  <Vector3D direction={v1} length={v1.length()} color={PrimeColor.black} />
  <Latex3D latex={String.raw`\mathbf{v_1}`} position={v1} color={PrimeColor.black} />

  <Vector3D direction={v2} length={v2.length()} color={PrimeColor.black} />
  <Latex3D latex={String.raw`\mathbf{v_2}`} position={v2} color={PrimeColor.black} />

  <!-- MARK: U & U_v -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.blue} />
  <Latex3D latex={String.raw`\mathbf{u}`} position={u} color={PrimeColor.blue} />

  <!-- U_v_perp -->
  <Vector3D direction={new Vector3(0, 1, 0)} length={u.y} color={PrimeColor.orange} />
  <Latex3D
    latex={String.raw`\mathbf{u}_{\mathcal{V}^{\perp}}`}
    position={new Vector3(0, u.y, 0)}
    extend={0.3}
    color={PrimeColor.orange}
  />

  <!-- MARK: Proj v1 & v2 -->
  <Vector3D
    direction={proj_v1}
    length={proj_v1.length()}
    color={PrimeColor.raspberry}
    alwaysOnTop
  />
  <Point3D position={proj_v1} color={PrimeColor.raspberry} />
  <Latex3D
    latex={String.raw`\text{proj}_{\mathbf{v_1}}\mathbf{u}`}
    position={proj_v1}
    extend={0.75}
    color={PrimeColor.raspberry}
    hasBackground
  />

  <Vector3D
    direction={proj_v2}
    length={proj_v2.length()}
    color={PrimeColor.raspberry}
    alwaysOnTop
  />
  <Point3D position={proj_v2} color={PrimeColor.raspberry} />
  <Latex3D
    latex={String.raw`\text{proj}_{\mathbf{v_2}}\mathbf{u}`}
    position={proj_v2}
    extend={0.75}
    color={PrimeColor.raspberry}
    hasBackground
  />

  <Vector3D
    direction={proj_v1.clone().add(proj_v2)}
    length={proj_v1.clone().add(proj_v2).length()}
    color={PrimeColor.raspberry}
    alwaysOnTop
  />
  <Latex3D
    latex={String.raw`\mathbf{u}_{\mathcal{V}}`}
    position={proj_v1.clone().add(proj_v2)}
    color={PrimeColor.raspberry}
  />

  <!-- MARK: Helper vectors -->
  {@render helperVector(proj_v1, proj_v2)}
  {@render helperVector(proj_v1, proj_v2.clone().add(proj_v3))}
  {@render helperVector(proj_v2, proj_v1)}
  {@render helperVector(proj_v2, proj_v1.clone().add(proj_v3))}
  {@render helperVector(new Vector3(0, u.y, 0), new Vector3(u.x, 0, u.z))}
  {@render helperVector(new Vector3(u.x, 0, u.z), new Vector3(0, u.y, 0))}

  <!-- MARK: V -->
  <PlaneFromNormal normal={new Vector3(0, 1, 0)} color={PrimeColor.darkGreen} />
  <Latex3D
    latex={String.raw`\mathcal{V}`}
    position={new Vector3(5.3, 0, 5.4)}
    color={PrimeColor.darkGreen}
  />
</Canvas3D>

{#snippet helperVector(origin, direction)}
  <Vector3D
    {origin}
    {direction}
    noNormalise
    color={PrimeColor.black}
    radius={0.5}
    hideHead
    isDashed
  />
{/snippet}
