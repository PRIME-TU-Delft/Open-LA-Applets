<script lang="ts" module>
  const renderParticles = (context: CanvasRenderingContext2D, particles: Particle[]) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = 0; i < particles.length; ++i) {
      renderParticle(context, particles[i]);
    }
  };

  /**
   * @returns {boolean} Returns false if no more confettis on the screen.
   */
  const updateParticles = (
    context: CanvasRenderingContext2D,
    particles: Particle[],
    dt: number
  ) => {
    let livingParticles = particles.length;

    for (let i = 0; i < particles.length; ++i) {
      const p = particles[i];
      if (p.dead) {
        livingParticles--;
      } else {
        updateParticle(p, dt);
        if (isOutOfBounds(context, p)) p.dead = true;
      }
    }

    return livingParticles > 0;
  };

  const start = (
    canvas: HTMLCanvasElement,
    onCompleted: () => void,
    particleCount: number,
    origin: Vector2 | undefined,
    force: number,
    angle: number,
    spread: number
  ) => {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No context?');

    const particles: Particle[] = Array.from({ length: particleCount }, () =>
      createParticle(context, origin, force, angle, spread)
    );

    let frameId: number, t: number;

    const run = (_t: number) => {
      renderParticles(context, particles);
      const stillRunning = updateParticles(context, particles, (_t - t) / 1e3);
      if (stillRunning) {
        t = _t;
        frameId = requestAnimationFrame(run);
      } else {
        onCompleted();
      }
    };

    t = performance.now();
    frameId = requestAnimationFrame(run);

    return () => {
      cancelAnimationFrame(frameId);
    };
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { Vector2 } from 'three';
  import {
    createParticle,
    isOutOfBounds,
    renderParticle,
    updateParticle,
    type Particle
  } from './particle';

  type ConfettiProps = {
    particleCount?: number;
    origin?: Vector2;
    force?: number;
    angle?: number;
    spread?: number;
    onComplete?: () => void;
  };

  let {
    particleCount = 50,
    origin,
    force = 15,
    angle = 0,
    spread = 360,
    onComplete = () => {}
  }: ConfettiProps = $props();

  let canvas: HTMLCanvasElement;
  let w = $state<number>();
  let h = $state<number>();

  onMount(() => {
    if (!w || !h) {
      /* eslint-disable-next-line no-console */
      console.warn('No width or height provided for the canvas');
      return;
    }

    canvas.width = w;
    canvas.height = h;
    return start(canvas, onComplete, particleCount, origin, force, angle, spread);
  });
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />
<canvas bind:this={canvas} width={w} height={h}></canvas>

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999999;
  }
</style>
