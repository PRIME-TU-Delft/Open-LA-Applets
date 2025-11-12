<script lang="ts">
  import CustomRenderer from '$lib/threlte/CustomRenderer.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { MeshLineGeometry, MeshLineMaterial, OrbitControls } from '@threlte/extras';
  import { Vector3 } from 'three';
  import vectorField from './vector_field.json';

  let elevation = -2;
  let azimuth = 180;
  let grid = true;

  let position = new Vector3(10, 3, 7);
  let zoom = 30;

  const points = vectorField as { x: number; y: number; u: number; v: number }[];

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
    const solution = solveMyIVP(x0, y0, tend, labda, gamma, mu);
    console.log(solution);
    return solution;
  }

  function toPoints(equation: { t: number[]; x: number[]; y: number[] }) {
    const points = [];
    for (let i = 0; i < equation.t.length; i += 50) {
      points.push(
        new Vector3(
          equation.x[i] * 5 - 6,
          equation.y[i],
          Math.sin(equation.t[i] * 5) * 3
        ).multiplyScalar(1.5)
      );
    }

    return points;
  }

  const equation = Van_der_Pol_like_equation(2, 0.67, 2, 0, 4, 7);
</script>

{#each points as { x, y, u, v }}
  <Vector3D
    color={PrimeColor.raspberry}
    length={1.5}
    origin={new Vector3(x * 5 - 6, y, 0).multiplyScalar(1.5)}
    direction={new Vector3(u, v, 0)}
    radius={0.75}
  />
{/each}

<T.Mesh>
  <MeshLineGeometry points={toPoints(equation)} />
  <MeshLineMaterial
    depthTest={true}
    width={0.01}
    color={PrimeColor.blue}
    dashOffset={0.1}
    dashArray={0.1 * 0.01}
  />
</T.Mesh>

<T.OrthographicCamera makeDefault position={[position.x, position.y, position.z]} fov={10} {zoom}>
  <OrbitControls
    enableZoom
    maxZoom={zoom * 10}
    minZoom={0.01}
    maxPolarAngle={Math.PI * 0.6}
    autoRotate={true}
    autoRotateSpeed={0.3}
  />
</T.OrthographicCamera>

<CustomRenderer {elevation} {azimuth} {grid} />
