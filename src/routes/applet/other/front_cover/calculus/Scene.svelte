<script lang="ts">
  /* eslint-disable no-restricted-syntax */

  import CustomRenderer from '$lib/threlte/CustomRenderer.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { MeshLineGeometry, MeshLineMaterial, OrbitControls } from '@threlte/extras';
  import { onMount } from 'svelte';
  import { BufferAttribute, BufferGeometry, DoubleSide, Vector3 } from 'three';
  import { OrthographicCamera } from 'three';
  import { OrbitControls as OrbitControlsJS } from 'three/addons/controls/OrbitControls.js';
  import vectorField from './vector_field.json';

  let elevation = -2;
  let azimuth = 180;
  let grid = true;
  let position = new Vector3(15.767101260667971, -5.914369353771287, -4.0388711259116725);
  const CAMERA_TARGET = new Vector3(-7.696125054506335, -13.769150686936293, 4.055745671137663);
  let zoom = 40;

  const ROTATE = false;

  const WORLD_SCALE = 1.5;
  const X_STRETCH = 5;
  const X_OFFSET = -6;
  const GRID_CENTER_X = X_OFFSET * WORLD_SCALE;
  const GRID_CENTER_Z = 0;
  const GRID_RADIUS = 30;

  const vectorFieldPoints = vectorField as { x: number; y: number; u: number; v: number }[];

  function isInsideGrid(x: number, z: number): boolean {
    const dx = x - GRID_CENTER_X;
    const dz = z - GRID_CENTER_Z;
    return dx * dx + dz * dz <= GRID_RADIUS * GRID_RADIUS;
  }

  function f(x: number, labda: number, gamma: number): number {
    if (Math.abs(x - labda) <= 1) {
      return 1 + labda ** 2 - 2 * labda * x + x ** 2;
    } else {
      return gamma * (1 - Math.sqrt(Math.abs(x - labda)));
    }
  }

  function ode(y: [number, number], labda: number, gamma: number, mu: number): [number, number] {
    const x = y[0];
    const yval = y[1];
    const rhsx = yval;
    const rhsy = -x + labda + mu * f(x, labda, gamma) * yval;
    return [rhsx, rhsy];
  }

  function solveMyIVP(
    x0: number,
    y0: number,
    tend: number,
    labda: number,
    gamma: number,
    mu: number
  ): { t: number[]; x: number[]; y: number[] } {
    const t0 = 0;
    const N = Math.min(Math.floor(tend * 1e3), 1e4);
    const tout: number[] = Array.from({ length: N + 1 }, (_, i) => t0 + (tend - t0) * (i / N));
    const dt = (tend - t0) / N;
    const yout: [number, number][] = Array(N + 1)
      .fill([0, 0])
      .map(() => [0, 0]);
    yout[0] = [x0, y0];

    for (let n = 0; n < N; n++) {
      const k1 = ode(yout[n], labda, gamma, mu).map((v) => dt * v) as [number, number];
      const yk2: [number, number] = [yout[n][0] + 0.5 * k1[0], yout[n][1] + 0.5 * k1[1]];
      const k2 = ode(yk2, labda, gamma, mu).map((v) => dt * v) as [number, number];
      const yk3: [number, number] = [yout[n][0] + 0.5 * k2[0], yout[n][1] + 0.5 * k2[1]];
      const k3 = ode(yk3, labda, gamma, mu).map((v) => dt * v) as [number, number];
      const yk4: [number, number] = [yout[n][0] + k3[0], yout[n][1] + k3[1]];
      const k4 = ode(yk4, labda, gamma, mu).map((v) => dt * v) as [number, number];

      yout[n + 1] = [
        yout[n][0] + (1 / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
        yout[n][1] + (1 / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])
      ];
    }

    const x: number[] = yout.map((v) => v[0]);
    const y: number[] = yout.map((v) => v[1]);
    return { t: tout, x, y };
  }

  function Van_der_Pol_like_equation(
    labda: number,
    mu: number,
    gamma: number,
    x0: number,
    y0: number,
    tend: number
  ) {
    return solveMyIVP(x0, y0, tend, labda, gamma, mu);
  }

  function toCurveSegments(equation: { t: number[]; x: number[]; y: number[] }) {
    const segments: Vector3[][] = [];
    let segment: Vector3[] = [];

    for (let i = 0; i < equation.t.length; i += 50) {
      const y_up_down = Math.sin(equation.t[i] * 5) * 4 - 8;
      const worldX = (equation.x[i] * X_STRETCH + X_OFFSET) * WORLD_SCALE;
      const worldZ = equation.y[i] * WORLD_SCALE;

      if (isInsideGrid(worldX, worldZ)) {
        segment.push(new Vector3(worldX, y_up_down * WORLD_SCALE, worldZ));
      } else if (segment.length > 1) {
        segments.push(segment);
        segment = [];
      } else {
        segment = [];
      }
    }

    if (segment.length > 1) {
      segments.push(segment);
    }

    return segments;
  }

  const equation = Van_der_Pol_like_equation(2, 0.67, 2, 0, 4, 7);
  const curveSegments = toCurveSegments(equation);
  const visibleVectors = vectorFieldPoints.filter(({ x, y }) => {
    const worldX = (x * X_STRETCH + X_OFFSET) * WORLD_SCALE;
    const worldZ = y * WORLD_SCALE;
    return isInsideGrid(worldX, worldZ);
  });
  const integralBaseY = -15.001;

  const integralGeometry = $derived.by(() => {
    const geometry = new BufferGeometry();
    const vertices: number[] = [];

    for (const segment of curveSegments) {
      for (let i = 0; i < segment.length - 1; i++) {
        const start = segment[i];
        const end = segment[i + 1];
        const startBase = new Vector3(start.x, integralBaseY, start.z);
        const endBase = new Vector3(end.x, integralBaseY, end.z);

        vertices.push(
          ...start.toArray(),
          ...startBase.toArray(),
          ...end.toArray(),
          ...end.toArray(),
          ...startBase.toArray(),
          ...endBase.toArray()
        );
      }
    }

    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();

    return geometry;
  });

  let orbitControlsRef = $state<OrbitControlsJS>();

  onMount(() => {
    if (!orbitControlsRef) return;

    orbitControlsRef.target.copy(CAMERA_TARGET);
    orbitControlsRef.update();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleCameraChange(event: any): void {
    const camera = event?.target?.object as OrthographicCamera;

    if (!camera) return;

    /* eslint-disable-next-line no-console */
    console.log('Camera position:', {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    });

    /* eslint-disable-next-line no-console */
    console.log('Camera target:', {
      x: orbitControlsRef?.target.x,
      y: orbitControlsRef?.target.y,
      z: orbitControlsRef?.target.z
    });

    /* eslint-disable-next-line no-console */
    console.log('Camera zoom:', camera.zoom);
  }
</script>

{#if curveSegments.length > 0}
  <T.Mesh geometry={integralGeometry}>
    <T.MeshBasicMaterial
      color={PrimeColor.yellow}
      side={DoubleSide}
      transparent={true}
      opacity={0.08}
      depthWrite={false}
      toneMapped={false}
    />
  </T.Mesh>
{/if}

{#each visibleVectors as { x, y, u, v } (`${x},${y},${u.toFixed(2)},${v.toFixed(2)}`)}
  <Vector3D
    color={PrimeColor.raspberry}
    length={1.5}
    origin={new Vector3(x * X_STRETCH + X_OFFSET, -9.9, y)
      .multiplyScalar(WORLD_SCALE)
      .sub(new Vector3(u, 0, v).normalize().multiplyScalar(0.75))}
    direction={new Vector3(u, 0, v)}
    radius={0.75}
  />
{/each}

{#each curveSegments as segment, idx (`${idx}-${segment.length}`)}
  <T.Mesh>
    <MeshLineGeometry points={segment} />
    <MeshLineMaterial
      depthTest={true}
      width={0.01}
      color={PrimeColor.blue}
      dashOffset={0.1}
      dashArray={0.1 * 0.01}
    />
  </T.Mesh>
{/each}

<T.OrthographicCamera makeDefault position={[position.x, position.y, position.z]} fov={10} {zoom}>
  <OrbitControls
    bind:ref={orbitControlsRef}
    enableZoom
    maxZoom={zoom * 10}
    minZoom={zoom}
    minPolarAngle={Math.PI * 0.1}
    maxPolarAngle={Math.PI * 0.9}
    target={[CAMERA_TARGET.x, CAMERA_TARGET.y, CAMERA_TARGET.z]}
    onchange={handleCameraChange}
    autoRotate={ROTATE}
    autoRotateSpeed={0.3}
  />
</T.OrthographicCamera>

<CustomRenderer {elevation} {azimuth} {grid} />
