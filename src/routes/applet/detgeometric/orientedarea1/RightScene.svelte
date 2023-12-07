<script lang="ts">
  import { Axis3D, Latex3D, Point3D, Vector3D, Parallelogram3D } from '$lib/threlte-components';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';

  export let u: Vector2;
  export let v: Vector2;

  $: tu = new MathVector3(u.x, u.y, 0);
  $: tv = new MathVector3(v.x, v.y, 0);
  $: uxv = tu.clone().cross(tv);

  $: C = tu.clone().add(tv); // C = u + v
</script>

<Axis3D showNumbers />

<Parallelogram3D points={[new Vector3(0, 0), tu, tv]} color={PrimeColor.yellow} strokeWidth={0.5} />

<Vector3D direction={tu} length={tu.length()} color={PrimeColor.red} let:endPoint>
  <Latex3D latex={'\\tilde{\\mathbf{u}}'} position={endPoint.clone().multiplyScalar(0.5)} />
  <Latex3D latex={'A'} offset={0.2} position={endPoint} />
  <Point3D position={endPoint} color={PrimeColor.red} />
</Vector3D>

<Vector3D direction={tv} length={tv.length()} color={PrimeColor.pink} let:endPoint>
  <Latex3D latex={'\\tilde{\\mathbf{v}}'} position={endPoint.clone().multiplyScalar(0.5)} />
  <Latex3D latex={'B'} offset={0.2} position={endPoint} />
  <Point3D position={endPoint} color={PrimeColor.pink} />
</Vector3D>

<Latex3D latex={'C = \\tilde{\\mathbf{u}} + \\tilde{\\mathbf{v}}'} offset={0.2} position={C} />

<Vector3D striped direction={uxv} length={uxv.length()} color={PrimeColor.ultramarine} let:endPoint>
  <Latex3D
    latex={'\\tilde{\\mathbf{u}} \\times \\tilde{\\mathbf{v}}'}
    offset={0.2}
    position={endPoint}
  />
  <Point3D position={endPoint} color={PrimeColor.ultramarine} />
</Vector3D>

<!-- e1 & e2 & e3 -->
<Vector3D direction={new Vector3(0, 0, 1)} length={1} color={PrimeColor.ultramarine} let:endPoint>
  <Latex3D latex={'\\mathbf{e_1}'} offset={0.1} position={endPoint} />
</Vector3D>
<Vector3D direction={new Vector3(1, 0, 0)} length={1} color={PrimeColor.ultramarine} let:endPoint>
  <Latex3D latex={'\\mathbf{e_2}'} offset={0.1} position={endPoint} />
</Vector3D>
<Vector3D direction={new Vector3(0, 1, 0)} length={1} color={PrimeColor.ultramarine} let:endPoint>
  <Latex3D latex={'\\mathbf{e_3}'} offset={0.1} position={endPoint} />
</Vector3D>
