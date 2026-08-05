import { Draggable } from '$lib/controls/Draggables.svelte';
import { clamp } from '$lib/utils/MathLib';
import { PrimeColor, type ColorString } from '$lib/utils/PrimeColors';
import {
  randomBernoulli,
  randomBinomial,
  randomExponential,
  randomGeometric,
  randomNormal,
  randomPareto,
  randomPoisson,
  randomUniform
} from 'd3';
import { Vector2 } from 'three';

export const NS = 'applets.pts.distributions.distributions.';

export const DISCRETE_TYPES = ['bernouli', 'binomial', 'geometric', 'poisson', 'uniform_die'];
export const CONTINUOUS_TYPES = ['normal', 'exponential', 'pareto', 'uniform'];

export interface SliderSpec {
  default: number;
  from: number;
  to: number;
  step: number;
  color: ColorString;
  label: string;
  integer?: boolean;
}

export interface Moments {
  expectedValue: string | number;
  variance: string | number;
  expColor: PrimeColor;
  varColor: PrimeColor;
}

export interface DistributionDef {
  category: 'discrete' | 'continuous';
  // extra sliders added after N, in order
  sliders: SliderSpec[];
  draggables?: () => Draggable[];
  // extra: values of `sliders` above, in order. drag: this distribution's draggables, in order.
  moments(extra: number[], drag: Draggable[]): Moments;
  sampler(extra: number[], drag: Draggable[]): () => number;
}

export const DISTRIBUTIONS: Record<string, DistributionDef> = {
  normal: {
    category: 'continuous',
    sliders: [
      { default: 2, from: 0, to: 4, step: 0.1, color: PrimeColor.raspberry, label: '\\sigma' }
    ],
    draggables: () => [
      new Draggable(new Vector2(4, 0), PrimeColor.orange, '\\mu', (v) => {
        return new Vector2(clamp(v.x, -10, 10), 0);
      })
    ],
    moments: (extra, drag) => {
      const mean_ = drag[0]?.position.x ?? 4;
      const sigma = extra[0] ?? 2;

      return {
        expectedValue: mean_.toFixed(2),
        variance: Math.pow(sigma, 2).toFixed(2),
        expColor: PrimeColor.orange,
        varColor: PrimeColor.raspberry
      };
    },
    sampler: (extra, drag) => {
      const mean_ = drag[0]?.position.x ?? 4;
      const sigma = extra[0] ?? 2;

      return randomNormal(mean_, sigma);
    }
  },
  exponential: {
    category: 'continuous',
    sliders: [
      {
        default: 1 / 2,
        from: 0.1,
        to: 3,
        step: 0.1,
        color: PrimeColor.raspberry,
        label: '\\lambda'
      }
    ],
    moments: (extra) => {
      const lambda = extra[0] ?? 1;

      return {
        expectedValue: Math.pow(lambda, -1).toFixed(2),
        variance: Math.pow(lambda, -2).toFixed(2),
        expColor: PrimeColor.raspberry,
        varColor: PrimeColor.raspberry
      };
    },
    sampler: (extra) => {
      const lambda = extra[0] ?? 1;

      return randomExponential(lambda);
    }
  },
  pareto: {
    category: 'continuous',
    sliders: [
      { default: 2, from: 0, to: 4, step: 0.2, color: PrimeColor.raspberry, label: '\\alpha' }
    ],
    draggables: () => [
      new Draggable(new Vector2(1, 0), PrimeColor.blue, 'x_0', (v) => {
        return new Vector2(clamp(v.x, 0, 10), 0);
      })
    ],
    moments: (extra, drag) => {
      const x0 = drag[0]?.position.x ?? 1;
      const alpha = extra[0] ?? 2;

      let expectedValue: string | number = ((alpha * x0) / (alpha - 1)).toFixed(2);
      let variance: string | number = (
        (alpha * x0 ** 2) /
        ((alpha - 1) ** 2 * (alpha - 2))
      ).toFixed(2);

      if (alpha <= 1) {
        expectedValue = '\\infty';
        variance = 'DNE';
      } else if (alpha <= 2) {
        variance = '\\infty';
      }

      return { expectedValue, variance, expColor: PrimeColor.black, varColor: PrimeColor.black };
    },
    sampler: (extra, drag) => {
      const x0 = drag[0]?.position.x ?? 1;
      const alpha = extra[0] ?? 2;

      const d3Pareto = randomPareto(alpha);
      return () => x0 * d3Pareto();
    }
  },
  uniform: {
    category: 'continuous',
    sliders: [],
    draggables: () => {
      const a = new Draggable(new Vector2(-2, 0), PrimeColor.raspberry, 'a');
      const b = new Draggable(new Vector2(8, 0), PrimeColor.blue, 'b', (v) => {
        return new Vector2(clamp(v.x, Math.max(-10, a.value.x), 10), 0);
      });

      a.snapFn = (v) => {
        return new Vector2(clamp(v.x, -10, Math.min(10, b.value.x)), 0);
      };
      return [a, b];
    },
    moments: (_extra, drag) => {
      const a = drag[0]?.position.x ?? -2;
      const b = drag[1]?.position.x ?? 8;

      return {
        expectedValue: ((a + b) / 2).toFixed(2),
        variance: (Math.pow(b - a, 2) / 12).toFixed(2),
        expColor: PrimeColor.black,
        varColor: PrimeColor.black
      };
    },
    sampler: (_extra, drag) => {
      const a = drag[0]?.position.x ?? -2;
      const b = drag[1]?.position.x ?? 8;

      return randomUniform(a, b);
    }
  },
  bernouli: {
    category: 'discrete',
    sliders: [
      { default: 0.5, from: 0, to: 1, step: 0.05, color: PrimeColor.raspberry, label: 'p' }
    ],
    moments: (extra) => {
      const p = extra[0] ?? 0.5;

      return {
        expectedValue: p.toFixed(2),
        variance: (p * (1 - p)).toFixed(2),
        expColor: PrimeColor.raspberry,
        varColor: PrimeColor.raspberry
      };
    },
    sampler: (extra) => {
      const p = extra[0] ?? 0.5;

      return randomBernoulli(p);
    }
  },
  binomial: {
    category: 'discrete',
    sliders: [
      { default: 0.5, from: 0, to: 1, step: 0.05, color: PrimeColor.raspberry, label: 'p' },
      { default: 10, from: 2, to: 20, step: 1, color: PrimeColor.blue, label: 'n', integer: true }
    ],
    moments: (extra) => {
      const p = extra[0] ?? 0.5;
      const n = extra[1] ?? 10;

      return {
        expectedValue: (n * p).toFixed(2),
        variance: (n * p * (1 - p)).toFixed(2),
        expColor: PrimeColor.black,
        varColor: PrimeColor.black
      };
    },
    sampler: (extra) => {
      const p = extra[0] ?? 0.5;
      const n = extra[1] ?? 10;

      return randomBinomial(n, p);
    }
  },
  geometric: {
    category: 'discrete',
    sliders: [
      { default: 0.5, from: 0, to: 1, step: 0.05, color: PrimeColor.raspberry, label: 'p' }
    ],
    moments: (extra) => {
      const p = extra[0] ?? 0.5;

      return {
        expectedValue: (1 / p).toFixed(2),
        variance: ((1 - p) / Math.pow(p, 2)).toFixed(2),
        expColor: PrimeColor.raspberry,
        varColor: PrimeColor.raspberry
      };
    },
    sampler: (extra) => {
      const p = extra[0] ?? 0.5;

      return randomGeometric(p);
    }
  },
  poisson: {
    category: 'discrete',
    sliders: [
      { default: 3, from: 0, to: 10, step: 0.5, color: PrimeColor.raspberry, label: '\\lambda' }
    ],
    moments: (extra) => {
      const lambda = extra[0] ?? 3;

      return {
        expectedValue: lambda.toFixed(2),
        variance: lambda.toFixed(2),
        expColor: PrimeColor.raspberry,
        varColor: PrimeColor.raspberry
      };
    },
    sampler: (extra) => {
      const lambda = extra[0] ?? 3;

      return randomPoisson(lambda);
    }
  },
  uniform_die: {
    category: 'discrete',
    sliders: [
      { default: 10, from: 2, to: 20, step: 1, color: PrimeColor.blue, label: 'n', integer: true }
    ],
    moments: (extra) => {
      const n = extra[0] ?? 6;

      return {
        expectedValue: ((n + 1) / 2).toFixed(2),
        variance: ((Math.pow(n, 2) - 1) / 12).toFixed(2),
        expColor: PrimeColor.blue,
        varColor: PrimeColor.blue
      };
    },
    sampler: (extra) => {
      const n = extra[0] ?? 6;

      const f = randomUniform(1, n + 1);
      return () => Math.floor(f());
    }
  }
};
