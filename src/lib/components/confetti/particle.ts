import type { Vector2 } from 'three';
import { PrimeColor, type ColorString } from '$lib/utils/PrimeColors';
import { BOUNDARY, DEG_TO_RAD, MOVEMENT_SPEED, ROTATION_SPEED } from './contants';

export type Particle = {
  dead: boolean;
  life: number;
  delay: number;
  x: number;
  y: number;
  angle: number;
  da: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
  gy: number;
  xw: number;
  color: ColorString;
};

export const random = (max: number, min = 0) => Math.random() * (max - min) + min;
export const coinFlip = () => Math.random() >= 0.5;

export type OnCreateParticle = (p: Particle) => Particle;

export const createParticle = (
  context: CanvasRenderingContext2D,
  origin: Vector2 | undefined,
  force: number,
  angle: number,
  spread: number
) => {
  const color = PrimeColor.getRandomColor();

  let dir,
    x,
    y,
    vx,
    vy,
    da = random(90, -90);

  if (origin) {
    // When we have an origin, we create a confetti burst
    x = origin.x;
    y = origin.y;
    vx = random(force, 5);
    vy = random(force, 5);
    dir = random(angle + spread / 2, angle - spread / 2) * DEG_TO_RAD;
    da *= 2;
  } else {
    // Otherwise we drop confetti from the top of the screen
    x = random(context.canvas.width);
    y = random(-BOUNDARY);
    vx = random(5);
    vy = random(5, 1);
    dir = random(180) * DEG_TO_RAD;
  }

  const dx = Math.cos(dir);
  const dy = Math.sin(dir);

  const particle: Particle = {
    dead: false,
    life: 0,
    delay: 0,
    x,
    y,
    angle: random(360),
    da,
    dx: dx * vx,
    dy: dy * vy,
    w: random(18, 10),
    h: random(6, 4),
    gy: random(4.5, 2),
    xw: random(6, 1),
    color
  };

  return particle;
};

export const renderParticle = (context: CanvasRenderingContext2D, p: Particle) => {
  if (p.dead || p.life < p.delay) return;
  context.save();
  context.translate(p.x, p.y);
  context.rotate(p.angle * DEG_TO_RAD);

  context.fillStyle = p.color;
  context.beginPath();
  context.rect(p.w * -0.5, p.h * -0.5, p.w, p.h);
  context.fill();
  context.restore();
};

export const updateParticle = (p: Particle, dt: number) => {
  p.life += dt;
  if (p.dead || p.life < p.delay) return;
  p.angle += p.da * dt * ROTATION_SPEED;
  p.dy += p.gy * dt * ROTATION_SPEED;
  p.dx += random(4, 2) * Math.sin(p.life * p.xw) * dt;
  p.dx *= 0.98;
  p.dy *= 0.98;
  p.x += p.dx * MOVEMENT_SPEED;
  p.y += p.dy * MOVEMENT_SPEED;
};

export const isOutOfBounds = (context: CanvasRenderingContext2D, p: Particle) =>
  p.x < -BOUNDARY ||
  p.x > context.canvas.width + BOUNDARY ||
  p.y > context.canvas.height + BOUNDARY;
