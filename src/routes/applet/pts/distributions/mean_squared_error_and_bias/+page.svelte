<script lang="ts">
  import { setContext } from 'svelte';
  setContext('dontScaleWithDefaultZoom', true);
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Circle2D from '$lib/d3/Circle2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { _ } from 'svelte-i18n';
  import { randomNormal } from 'd3';
  import { Vector2 } from 'three';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

  let mu_x: number = $state(0);
  let mu_y: number = $state(0);

  let omega_x: number = $state(0);
  let omega_y: number = $state(0);

  type ControlStage = 'mu' | 'omega' | 'arrow';

  let stage: ControlStage = $state('mu');

  const meanControls = $derived.by(() => {
    const cont = Controls.addSlider(0, -8, 8, 0.5, PrimeColor.darkGreen, {
      label: '\\mu_x'
    }).addSlider(0, -8, 8, 0.5, PrimeColor.blue, {
      label: '\\mu_y'
    });

    return cont.addButton(
      $_('applets.pts.distributions.distributions.next'),
      PrimeColor.raspberry,
      () => {
        mu_x = cont[0];
        mu_y = cont[1];
        stage = 'omega';
      }
    );
  });

  const omegaControls = $derived.by(() => {
    const cont = Controls.addSlider(0, 0, 3, 0.5, PrimeColor.yellow, {
      label: '\\sigma_x'
    }).addSlider(0, 0, 3, 0.5, PrimeColor.orange, {
      label: '\\sigma_y'
    });

    return cont.addButton(
      $_('applets.pts.distributions.distributions.next'),
      PrimeColor.raspberry,
      () => {
        omega_x = cont[0];
        omega_y = cont[1];

        stage = 'arrow';
      }
    );
  });

  type Point = {
    x: number;
    y: number;
  };

  let points: Point[] = $state([]);

  const arrowControls = $derived.by(() => {
    return Controls.addButton(
      $_('applets.pts.distributions.mean_squared_error_and_bias.shoot'),
      PrimeColor.raspberry,
      () => {
        for (let i = 0; i < 5; i++) {
          points.push({
            x: randomNormal(mu_x, omega_x)(),
            y: randomNormal(mu_y, omega_y)()
          });
        }
      }
    ).addButton(
      $_('applets.pts.distributions.mean_squared_error_and_bias.clear'),
      PrimeColor.raspberry,
      () => {
        points = [];
      }
    );
  });

  const controls = $derived.by(() => {
    switch (stage) {
      case 'mu':
        return meanControls;

      case 'omega':
        return omegaControls;

      case 'arrow':
        return arrowControls;
    }
  });

  let hoveredPoint: number | null = $state(null);

  const dists = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const ptVals = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  const formulas = $derived.by(() => {
    const scores = points.map((p) => {
      const r = Math.hypot(p.x, p.y);

      const ring = dists.findIndex((dist) => r <= dist);

      return ring === -1 ? 0 : ptVals[ring];
    });

    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const pts = new Formula(`\\text{\\$1: } \\$2`)
      .addAutoParam($_('applets.pts.distributions.mean_squared_error_and_bias.points'))
      .addAutoParam(
        points.length === 0 ? 0 : (totalScore / points.length).toFixed(2),
        PrimeColor.blue
      );
    const average = (array: number[]) =>
      (array.reduce((a: number, b: number) => a + b) / array.length).toFixed(2);
    const mse = (array: number[]) =>
      (array.reduce((a: number, b: number) => a + b ** 2) / array.length).toFixed(2);
    const mean_x = new Formula(`\\bar{x_n} = \\$1`).addAutoParam(
      points.length === 0 ? 0 : average(points.map((p) => p.x)),
      PrimeColor.blue
    );
    const mean_y = new Formula(`\\bar{y_n} = \\$1`).addAutoParam(
      points.length === 0 ? 0 : average(points.map((p) => p.y)),
      PrimeColor.blue
    );
    const mse_x = new Formula(
      `\\text{MSE(x)} \\approx \\frac{1}{n}(x^2_1+ \\ldots + x^2_n) = \\$1`
    ).addAutoParam(points.length === 0 ? 0 : mse(points.map((p) => p.x)), PrimeColor.blue);
    const mse_y = new Formula(
      `\\text{MSE(y)} \\approx \\frac{1}{n}(y^2_1+ \\ldots + y^2_n) = \\$1`
    ).addAutoParam(points.length === 0 ? 0 : mse(points.map((p) => p.y)), PrimeColor.blue);

    return new Formulas(pts, mean_x, mean_y, mse_x, mse_y).align();
  });
</script>

<Canvas2D
  {controls}
  {formulas}
  title={$_('applets.pts.distributions.mean_squared_error_and_bias.title')}
  cameraZoom={0.35}
  onReset={() => {
    points = [];
    stage = 'mu';
    mu_x = 0;
    mu_y = 0;
    omega_x = 0;
    omega_y = 0;
  }}
  legendItems={[
    new LegendItem(
      `\\text{${$_('applets.pts.distributions.mean_squared_error_and_bias.target')}}`,
      PrimeColor.darkBlue
    ),
    new LegendItem(
      `\\text{${$_('applets.pts.distributions.mean_squared_error_and_bias.miss')}}`,
      PrimeColor.raspberry
    )
  ]}
  // target
>
  <Circle2D radius={10} color={PrimeColor.red} fill={PrimeColor.red} />
  <Circle2D radius={9} color={PrimeColor.red} fill={PrimeColor.white} />
  <Circle2D radius={8} color={PrimeColor.red} fill={PrimeColor.red} />
  <Circle2D radius={7} color={PrimeColor.red} fill={PrimeColor.white} />
  <Circle2D radius={6} color={PrimeColor.red} fill={PrimeColor.red} />
  <Circle2D radius={5} color={PrimeColor.red} fill={PrimeColor.white} />
  <Circle2D radius={4} color={PrimeColor.red} fill={PrimeColor.red} />
  <Circle2D radius={3} color={PrimeColor.red} fill={PrimeColor.white} />
  <Circle2D radius={2} color={PrimeColor.red} fill={PrimeColor.red} />
  <Circle2D radius={1} color={PrimeColor.red} fill={PrimeColor.white} />

  {#each dists as dist (dist)}
    <Latex2D
      latex={`\\text{${10 - dist}}`}
      position={new Vector2((dist + 0.5) / Math.sqrt(2), (dist + 0.5) / Math.sqrt(2))}
      color={PrimeColor.black}
    />
  {/each}

  <Latex2D latex={`\\text{10}`} position={new Vector2(-0.15, 0.2)} color={PrimeColor.black} />

  {#each points as point, i (i)}
    <Circle2D
      radius={0.15}
      color={Math.sqrt(point.x ** 2 + point.y ** 2) <= 10
        ? PrimeColor.darkBlue
        : PrimeColor.raspberry}
      position={new Vector2(point.x, point.y)}
      fill={Math.sqrt(point.x ** 2 + point.y ** 2) <= 10
        ? PrimeColor.darkBlue
        : PrimeColor.raspberry}
    />

    <circle
      cx={point.x}
      cy={point.y}
      r={0.4}
      fill="transparent"
      stroke="none"
      role="presentation"
      onmouseenter={() => (hoveredPoint = i)}
      onmouseleave={() => (hoveredPoint = null)}
    />
  {/each}

  {#if hoveredPoint !== null}
    {@const point = points[hoveredPoint]}

    <Latex2D
      latex={`\\left(${point.x.toFixed(2)},\\,${point.y.toFixed(2)}\\right)`}
      position={new Vector2(point.x, point.y)}
      offset={new Vector2(0.2, -0.2)}
      alignX="left"
      alignY="bottom"
      color={PrimeColor.black}
      background={'#eaeaea59'}
      fontSize={1.5}
      padding="0.15em"
    />
  {/if}
</Canvas2D>
