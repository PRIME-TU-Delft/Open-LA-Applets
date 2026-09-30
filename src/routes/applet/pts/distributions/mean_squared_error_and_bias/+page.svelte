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
  import Point2D from '$lib/d3/Point2D.svelte';

  let mu_x: number = $state(0);
  let mu_y: number = $state(0);

  let sigma_x: number = $state(0);
  let sigma_y: number = $state(0);

  type ControlStage = 'mu1' | 'mu2' | 'sigma1' | 'sigma2' | 'arrow';

  let stage: ControlStage = $state('mu1');

  const meanControls1 = $derived.by(() => {
    const cont = Controls.addSlider(0, -8, 8, 0.5, PrimeColor.darkGreen, {
      label: '\\mu_x'
    });

    return cont.addButton(
      $_('applets.pts.distributions.distributions.next'),
      PrimeColor.raspberry,
      () => {
        mu_x = cont[0];
        stage = 'mu2';
      }
    );
  });

  const meanControls2 = $derived.by(() => {
    const cont = Controls.addSlider(0, -8, 8, 0.5, PrimeColor.blue, {
      label: '\\mu_y'
    });

    return cont.addButton(
      $_('applets.pts.distributions.distributions.next'),
      PrimeColor.raspberry,
      () => {
        mu_y = cont[0];
        stage = 'sigma1';
      }
    );
  });

  const sigmaControls1 = $derived.by(() => {
    const cont = Controls.addSlider(0, 0, 3, 0.5, PrimeColor.yellow, {
      label: '\\sigma_x'
    });

    return cont.addButton(
      $_('applets.pts.distributions.distributions.next'),
      PrimeColor.raspberry,
      () => {
        sigma_x = cont[0];
        stage = 'sigma2';
      }
    );
  });

  const sigmaControls2 = $derived.by(() => {
    const cont = Controls.addSlider(0, 0, 3, 0.5, PrimeColor.orange, {
      label: '\\sigma_y'
    });

    return cont.addButton(
      $_('applets.pts.distributions.distributions.next'),
      PrimeColor.raspberry,
      () => {
        sigma_y = cont[0];
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
            x: randomNormal(mu_x, sigma_x)(),
            y: randomNormal(mu_y, sigma_y)()
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
      case 'mu1':
        return meanControls1;

      case 'mu2':
        return meanControls2;

      case 'sigma1':
        return sigmaControls1;

      case 'sigma2':
        return sigmaControls2;

      case 'arrow':
        return arrowControls;
    }
  });

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
      (array.reduce((a: number, b: number) => a + b, 0) / array.length).toFixed(2);
    const mse = (array: number[]) =>
      (array.reduce((a: number, b: number) => a + b ** 2, 0) / array.length).toFixed(2);

    const mean_x = new Formula(`\\bar{x_{\\$1}} = \\$2`)
      .addAutoParam(points.length === 0 ? 'n' : points.length)
      .addAutoParam(points.length === 0 ? 0 : average(points.map((p) => p.x)), PrimeColor.blue);
    const mean_y = new Formula(`\\bar{y_{\\$1}} = \\$2`)
      .addAutoParam(points.length === 0 ? 'n' : points.length)
      .addAutoParam(points.length === 0 ? 0 : average(points.map((p) => p.y)), PrimeColor.blue);
    const mse_x = new Formula(
      `\\text{MSE(x)} \\approx \\frac{1}{\\$1}(x^2_1+ \\ldots + x^2_{\\$2}) = \\$3`
    )
      .addAutoParam(points.length === 0 ? 'n' : points.length)
      .addAutoParam(points.length === 0 ? 'n' : points.length)
      .addAutoParam(points.length === 0 ? 0 : mse(points.map((p) => p.x)), PrimeColor.blue);
    const mse_y = new Formula(
      `\\text{MSE(y)} \\approx \\frac{1}{\\$1}(y^2_1+ \\ldots + y^2_{\\$2}) = \\$3`
    )
      .addAutoParam(points.length === 0 ? 'n' : points.length)
      .addAutoParam(points.length === 0 ? 'n' : points.length)
      .addAutoParam(points.length === 0 ? 0 : mse(points.map((p) => p.y)), PrimeColor.blue);

    const mus = new Formula(`\\mu_x = \\$1 \\text{\t} \\mu_y = \\$2`)
      .addAutoParam(mu_x, PrimeColor.blue)
      .addAutoParam(mu_y, PrimeColor.blue);

    const sigmas = new Formula(`\\sigma_x = \\$1 \\text{\t\t} \\sigma_y = \\$2`)
      .addAutoParam(sigma_x, PrimeColor.blue)
      .addAutoParam(sigma_y, PrimeColor.blue);

    return new Formulas(pts, mean_x, mean_y, mse_x, mse_y, mus, sigmas).align();
  });
</script>

<Canvas2D
  {controls}
  {formulas}
  title={$_('applets.pts.distributions.mean_squared_error_and_bias.title')}
  cameraZoom={0.35}
  onReset={() => {
    points = [];
    stage = 'mu1';
    mu_x = 0;
    mu_y = 0;
    sigma_x = 0;
    sigma_y = 0;
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
    <Point2D
      radius={0.15}
      color={Math.sqrt(point.x ** 2 + point.y ** 2) <= 10
        ? PrimeColor.darkBlue
        : PrimeColor.raspberry}
      position={new Vector2(point.x, point.y)}
      fill={Math.sqrt(point.x ** 2 + point.y ** 2) <= 10
        ? PrimeColor.darkBlue
        : PrimeColor.raspberry}
      showTextOnlyOnHover={true}
      text={`\\left(${point.x.toFixed(2)},\\,${point.y.toFixed(2)}\\right)`}
      offset={new Vector2(0.2, 0.4)}
      background="#dededecc"
      fontSize={1.6}
    />
  {/each}
</Canvas2D>
