<script lang="ts">
  import { RightAngle, Axis2D, Canvas2D, Line2D, Vector2D, Latex2D } from '$lib/d3-components';

  import { Vector2, Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let v = new Vector2(3, -3);
  let v_ortho = new Vector2(3, 3);

  let ve = new Vector3(3, -3, -3);
</script>

<div class="wrapper">
  <div class="panel">
    <Canvas2D>
      <!-- v -->
      <Vector2D
        direction={v}
        length={v.length() * 2}
        color={PrimeColor.green}
        origin={v.clone().multiplyScalar(-1)}
      >
        <Latex2D latex={'\\mathbf{v}'} position={v.clone().add(new Vector2(-0.3, -0.1))} />
      </Vector2D>

      <!-- v_ortho -->
      <Vector2D
        direction={v_ortho}
        length={v_ortho.length() * 2}
        color={PrimeColor.ultramarine}
        origin={v_ortho.clone().multiplyScalar(-1)}
      >
        <Latex2D
          latex={'\\mathbf{v\\perp}'}
          position={v_ortho.clone().add(new Vector2(-0.3, 0.3))}
        />
      </Vector2D>

      <!-- Arcs -->
      <RightAngle vs={[v, v_ortho]} />
    </Canvas2D>
  </div>

  <div class="panel">
    <Canvas3D>
      <!-- v -->
      <Vector3D direction={ve} length={ve.length()} color={PrimeColor.green} />

      <Latex3D latex={'T(\\mathbf{v})'} position={ve} />

      <Axis3D />
    </Canvas3D>
  </div>
</div>

<style>
  .formula {
    position: absolute;
    left: 50%;
    top: 30%;
    scale: 1.5;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  .wrapper {
    display: flex;
    gap: 1rem;
    height: 100%;
  }

  .panel {
    width: 50vw;
    height: 100%;
  }
</style>
