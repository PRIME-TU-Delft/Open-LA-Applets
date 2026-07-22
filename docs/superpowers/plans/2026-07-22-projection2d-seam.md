# Projection2D Seam Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the smeared `scale2D` context convention with a single deep **Projection2D** module — the world↔screen seam — set once by `CanvasD3` and consumed through a small interface by every 2D primitive.

**Architecture:** `Projection2D` is a pure TS class (`src/lib/utils/Projection2D.ts`) holding `scaleX`/`scaleY` and exposing `toScreen`/`toWorld`/`toScreenDir`. `CanvasD3` constructs one and publishes it via Svelte context. Primitives read it with a `getProjection2D()` helper and call `toScreen(p)` instead of hand-multiplying by `sx`/`sy`. The container "identity reset" hack is deleted: containers pass **world** coordinates to child primitives and let each leaf project exactly once.

**Tech Stack:** SvelteKit, Svelte 5 runes, `three` (`Vector2`), D3 (SVG), Vitest.

## Global Constraints

- **Scale applies to coordinates, never to sizes.** Radii, stroke widths, arrowhead/cone dimensions stay in their current units and are NOT passed through `toScreen`. This is why a single wrapping `<g transform="scale(sx,sy)">` cannot replace the module — only coordinates move.
- `Vector2` type is `three`'s `Vector2` (`import { Vector2 } from 'three'`).
- Svelte context calls (`getContext`/`setContext`) must run at component-init top level; the helper functions that wrap them inherit that restriction — call them at the top of `<script>`, not inside effects/handlers.
- Migration is **incremental and non-breaking**: `CanvasD3` dual-publishes both the old `scale2D` context and the new `Projection2D` until every consumer is migrated (final task removes the old one). At no point between tasks should an applet double-scale or lose scale.
- Verification per task: `pnpm check` (types) and `pnpm test` (module unit tests). There is no component-render test harness in this repo (only `src/lib/utils/*.test.ts` exist), so primitive behavior is verified by (a) `pnpm check` and (b) manual visual check in `pnpm dev` / `pnpm storybook` against a non-uniform-scale applet. Use `scaleX`/`scaleY` differing (e.g. an applet passing `scaleX={2} scaleY={1}` to `Canvas2D`) as the visual test bed.
- Commit after every task with a `feat:`/`refactor:` message.

---

## File Structure

**New files:**
- `src/lib/utils/Projection2D.ts` — the module: `Projection2D` class + `IDENTITY_PROJECTION` + `setProjection2D`/`getProjection2D` context helpers. One responsibility: the world↔screen transform and its seam.
- `src/lib/utils/Projection2D.test.ts` — unit tests, no component mount.

**Modified files (23):**
- `src/lib/d3/CanvasD3.svelte` — constructs and publishes the projection.
- 18 primitives that currently read `getContext('scale2D')` (migrate to `getProjection2D()`):
  Point2D, Line2D, Rect2D, Circle2D, Triangle2D, Polygon2D, Vector2D, Axis, Draggable2D,
  Latex2D, InfiniteLine2D, Angle2D, RightAngle2D, Trajectory2D,
  ExplicitFunction2D, ImplicitFunction2D, ParameterizedFunction2D, FillBetweenFunctions2D.
- 7 of those 18 also carry the identity-reset hack (`setContext('scale2D', { x: 1, y: 1 })`) to delete:
  Vector2D, Axis, RightAngle2D, Trajectory2D, ImplicitFunction2D, ExplicitFunction2D, ParameterizedFunction2D.
- 5 scale-blind wrappers to verify/annotate: Arc2D, Parallelogram2D, PolarGrid, SmallestArc2D, Histogram2D.

**Interface (the whole external surface of the module):**

```ts
class Projection2D {
  readonly scaleX: number;
  readonly scaleY: number;
  constructor(scaleX: number, scaleY: number);
  toScreen(p: Vector2): Vector2;     // world point  -> screen point   (p.x*sx, p.y*sy)
  toWorld(p: Vector2): Vector2;      // screen point -> world point    (p.x/sx, p.y/sy)  (inverse; for drag input)
  toScreenDir(d: Vector2): Vector2;  // world direction -> UNIT screen-space direction  normalize(d.x*sx, d.y*sy)
}
const IDENTITY_PROJECTION: Projection2D;              // scaleX=scaleY=1
function setProjection2D(p: Projection2D): void;      // context publish (call in CanvasD3)
function getProjection2D(): Projection2D;             // context read; returns IDENTITY_PROJECTION if unset
```

**Design notes for the implementer (read before Task 1):**
- `toScreenDir` returns a **unit** vector: it collapses Vector2D's `worldDirection` / `screenDir` / `screenDirSign` trio into one call. The signed-length handling stays in Vector2D (multiply the unit dir by the signed cone length as today).
- Sizes stay untouched: in Vector2D, `CONE_HEIGHT`/`CONE_DIAMETER`/`radius` are NOT projected. Only origin, endpoint, and direction go through the projection.
- The deleted reset hack is replaced by a **discipline**, not a runtime guard: a container must hand **world** coordinates to any child primitive (the child projects once) and only call `toScreen` for geometry it emits as its own SVG. Grep after migration confirms zero `setContext('scale2D'` remain.

---

## Task 1: Projection2D module + unit tests

**Files:**
- Create: `src/lib/utils/Projection2D.ts`
- Test: `src/lib/utils/Projection2D.test.ts`

**Interfaces:**
- Consumes: `Vector2` from `three`; `getContext`/`setContext` from `svelte`.
- Produces: the full interface listed above. Every later task depends on these exact names.

- [ ] **Step 1: Write the failing test**

`src/lib/utils/Projection2D.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { Vector2 } from 'three';
import { Projection2D, IDENTITY_PROJECTION } from './Projection2D';

describe('Projection2D', () => {
  const p = new Projection2D(2, 4);

  it('toScreen scales coordinates by scaleX/scaleY', () => {
    const s = p.toScreen(new Vector2(3, 5));
    expect(s.x).toBe(6);
    expect(s.y).toBe(20);
  });

  it('toWorld is the inverse of toScreen', () => {
    const world = new Vector2(3, 5);
    const round = p.toWorld(p.toScreen(world));
    expect(round.x).toBeCloseTo(3);
    expect(round.y).toBeCloseTo(5);
  });

  it('toScreenDir returns a unit vector', () => {
    const d = p.toScreenDir(new Vector2(1, 1));
    expect(d.length()).toBeCloseTo(1);
  });

  it('toScreenDir points along the scaled direction under non-uniform scale', () => {
    // world dir (1,1) under scale (2,4) -> (2,4) -> angle atan2(4,2)
    const d = p.toScreenDir(new Vector2(1, 1));
    expect(d.angle()).toBeCloseTo(Math.atan2(4, 2));
  });

  it('toScreenDir handles the zero vector without NaN', () => {
    const d = p.toScreenDir(new Vector2(0, 0));
    expect(Number.isNaN(d.x)).toBe(false);
    expect(Number.isNaN(d.y)).toBe(false);
  });

  it('does not mutate its input', () => {
    const input = new Vector2(3, 5);
    p.toScreen(input);
    expect(input.x).toBe(3);
    expect(input.y).toBe(5);
  });

  it('IDENTITY_PROJECTION is a no-op', () => {
    const v = new Vector2(7, 9);
    expect(IDENTITY_PROJECTION.toScreen(v)).toEqual(v);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/utils/Projection2D.test.ts`
Expected: FAIL — cannot resolve `./Projection2D`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/utils/Projection2D.ts`:

```ts
import { getContext, setContext } from 'svelte';
import { Vector2 } from 'three';

/**
 * The world↔screen seam for 2D applets. Scale applies to COORDINATES, never to
 * sizes (radii, stroke widths, arrowheads). Construct one in CanvasD3 and read
 * it in primitives via getProjection2D().
 */
export class Projection2D {
  constructor(
    public readonly scaleX: number,
    public readonly scaleY: number
  ) {}

  /** World point → screen point. */
  toScreen(p: Vector2): Vector2 {
    return new Vector2(p.x * this.scaleX, p.y * this.scaleY);
  }

  /** Screen point → world point (inverse; for drag input). */
  toWorld(p: Vector2): Vector2 {
    return new Vector2(p.x / this.scaleX, p.y / this.scaleY);
  }

  /** World direction → UNIT direction in screen space. Zero-safe. */
  toScreenDir(d: Vector2): Vector2 {
    const screen = new Vector2(d.x * this.scaleX, d.y * this.scaleY);
    const len = screen.length();
    return len === 0 ? screen : screen.divideScalar(len);
  }
}

export const IDENTITY_PROJECTION = new Projection2D(1, 1);

const PROJECTION_KEY = 'projection2D';

export function setProjection2D(projection: Projection2D): void {
  setContext(PROJECTION_KEY, projection);
}

export function getProjection2D(): Projection2D {
  return (getContext(PROJECTION_KEY) as Projection2D | undefined) ?? IDENTITY_PROJECTION;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/utils/Projection2D.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/Projection2D.ts src/lib/utils/Projection2D.test.ts
git commit -m "feat: add Projection2D world<->screen seam module"
```

---

## Task 2: Publish Projection2D from CanvasD3 (dual-publish, non-breaking)

**Files:**
- Modify: `src/lib/d3/CanvasD3.svelte:78`

**Interfaces:**
- Consumes: `Projection2D`, `setProjection2D` from Task 1; existing `scaleX`/`scaleY` props (default `1`).
- Produces: a `Projection2D` on context key `projection2D`. Old `scale2D` context stays published until Task 9.

- [ ] **Step 1: Add the import**

In the `<script>` imports of `src/lib/d3/CanvasD3.svelte`, add:

```ts
import { Projection2D, setProjection2D } from '$lib/utils/Projection2D';
```

- [ ] **Step 2: Publish alongside the existing context**

At `src/lib/d3/CanvasD3.svelte:78`, keep the existing line and add the new publish immediately after it:

```ts
  // svelte-ignore state_referenced_locally
  setContext('scale2D', { x: scaleX, y: scaleY });
  // svelte-ignore state_referenced_locally
  setProjection2D(new Projection2D(scaleX, scaleY));
```

- [ ] **Step 3: Verify types**

Run: `pnpm check`
Expected: PASS, no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/d3/CanvasD3.svelte
git commit -m "feat: publish Projection2D context from CanvasD3 alongside scale2D"
```

---

## Migration recipe (applies to Tasks 3–8)

Every leaf-primitive migration is the same mechanical edit. **Read this once; each task below points back here and lists its file-specific call sites.**

**A. Replace the context read.** Delete:

```ts
const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
const sx = _scale2D?.x ?? 1;
const sy = _scale2D?.y ?? 1;
```

(the local var names vary: some files use `scaleX`/`scaleY` instead of `sx`/`sy`). Replace with:

```ts
const projection = getProjection2D();
```

Add `import { getProjection2D } from '$lib/utils/Projection2D';` and remove `getContext` from the `svelte` import if it becomes unused (`pnpm check` / `pnpm lint` will tell you).

**B. Replace the multiplies.**
- A full point `new Vector2(p.x * sx, p.y * sy)` → `projection.toScreen(p)`.
- A scalar in markup like `x1={start.x * sx}` → introduce `const startS = $derived(projection.toScreen(start));` in the script and use `x1={startS.x}`, `y1={startS.y}`.
- A world-space scalar tick `tick * scaleX` → `tick * projection.scaleX` (a single-axis scalar with no paired `Vector2` stays a raw `scaleX`/`scaleY` access; do NOT force it through `toScreen`).
- An inverse `event.x / scaleX, event.y / scaleY` → `projection.toWorld(new Vector2(event.x, event.y))`.

**C. Sizes stay raw.** Never wrap a radius, width, cone dimension, or offset in `toScreen`.

**D. Container reset removal (only the 7 reset files).** Delete the line `setContext('scale2D', { x: 1, y: 1 });`. Then ensure every child primitive receives **world** coordinates (unscaled) — the child now projects itself. Any value the container had pre-scaled specifically to feed a child must be reverted to world space; any value it emits as its own SVG uses `projection.toScreen`. Each reset task below spells out which is which for that file.

**E. Verify.** `pnpm check` must pass. Then visually confirm in `pnpm dev`/`pnpm storybook` against a non-uniform-scale applet that the primitive renders identically to `main` (this refactor is behavior-preserving for the 18 already-scaling primitives).

---

## Task 3: Migrate simple leaf primitives (no reset hack)

These read `scale2D` and emit their own SVG; none set the identity reset. Batch them — they are independent and mechanical.

**Files (migrate each per recipe A–C, E):**
- `src/lib/d3/Point2D.svelte:38-41` — `scaledPos = new Vector2(position.x*sx, position.y*sy)` → `projection.toScreen(position)`.
- `src/lib/d3/Line2D.svelte:18-20` + template `x1/y1/x2/y2` (lines ~30-33) — add `const startS = $derived(projection.toScreen(start)); const endS = $derived(projection.toScreen(end));` and use `startS.x`/`startS.y`/`endS.x`/`endS.y`.
- `src/lib/d3/Rect2D.svelte:12-14` — replace the two multiply sites.
- `src/lib/d3/Circle2D.svelte:24-26` — replace the multiply sites (7); keep radius raw.
- `src/lib/d3/Triangle2D.svelte:12-14` — replace the multiply site.
- `src/lib/d3/Polygon2D.svelte:25-27` — replace the multiply site (points map).
- `src/lib/d3/Latex2D.svelte:35-37` — replace the multiply site; keep offset/extend raw.
- `src/lib/d3/InfiniteLine2D.svelte:24-26` — replace the two multiply sites.
- `src/lib/d3/Angle2D.svelte:30-32` — replace the multiply site (origin). NOTE: Angle2D draws a circular arc; see Task 8 for the non-uniform-scale ellipse limitation. For this task, only migrate the origin projection; do not attempt to fix arc curvature.
- `src/lib/d3/FillBetweenFunctions2D.svelte` — replace the 6 multiply sites (sampled curve points → `toScreen`).

**Interfaces:**
- Consumes: `getProjection2D()` from Task 1.
- Produces: no new exports; behavior unchanged.

- [ ] **Step 1:** Migrate `Point2D.svelte` per recipe. Run `pnpm check`.
- [ ] **Step 2:** Migrate `Line2D.svelte` per recipe (script-derived screen points). Run `pnpm check`.
- [ ] **Step 3:** Migrate `Rect2D`, `Circle2D`, `Triangle2D`, `Polygon2D`. Run `pnpm check` after the batch.
- [ ] **Step 4:** Migrate `Latex2D`, `InfiniteLine2D`, `Angle2D`, `FillBetweenFunctions2D`. Run `pnpm check`.
- [ ] **Step 5:** Visual check — open a non-uniform-scale applet in `pnpm dev`; confirm points/lines/circles/polygons render identically to `main`.
- [ ] **Step 6: Commit**

```bash
git add src/lib/d3/Point2D.svelte src/lib/d3/Line2D.svelte src/lib/d3/Rect2D.svelte \
  src/lib/d3/Circle2D.svelte src/lib/d3/Triangle2D.svelte src/lib/d3/Polygon2D.svelte \
  src/lib/d3/Latex2D.svelte src/lib/d3/InfiniteLine2D.svelte src/lib/d3/Angle2D.svelte \
  src/lib/d3/FillBetweenFunctions2D.svelte
git commit -m "refactor: migrate leaf 2D primitives to Projection2D"
```

---

## Task 4: Migrate Vector2D (collapse dual coordinate representation)

The sharpest win. Vector2D currently keeps `scaledOrigin`, `endPoint`, `worldDirection`, `screenDir`, `screenDirSign` and sets the identity reset so its `Line2D`/`Triangle2D`/`Point2D` children don't double-scale. New shape: project origin/end via `toScreen`, get the on-screen unit direction via `toScreenDir`, keep the signed-length handling, drop the reset, and pass **world** coords to children.

**Files:**
- Modify: `src/lib/d3/Vector2D.svelte:41-68` (script) and `:90-133` (template).

**Interfaces:**
- Consumes: `getProjection2D()`, `Projection2D.toScreen`, `Projection2D.toScreenDir`.
- Produces: behavior unchanged (arrowhead points along the on-screen line under non-uniform scale, as today).

- [ ] **Step 1: Replace the script block.** Replace `src/lib/d3/Vector2D.svelte:41-68` with:

```ts
  const projection = getProjection2D();

  const CONE_HEIGHT = $derived(Math.max(7 * radius, 0.4));
  const CONE_DIAMETER = $derived(Math.max(1.5 * radius, 0.1));

  const normalizedDirection = $derived(noNormalise ? direction : direction.clone().normalize());
  const coneHeight = $derived(hideHead ? 0 : headLength !== undefined ? headLength : CONE_HEIGHT);

  const displayEnd = $derived(
    origin.clone().add(normalizedDirection.clone().multiplyScalar(length))
  );

  // world coords projected once, in screen space
  const scaledOrigin = $derived(projection.toScreen(origin));
  const endPoint = $derived(projection.toScreen(displayEnd));

  // on-screen unit direction; sign carries a negative length
  const screenDirSign = $derived(length < 0 ? -1 : 1);
  const screenDir = $derived(
    projection.toScreenDir(normalizedDirection).multiplyScalar(screenDirSign)
  );

  const coneStartPos = $derived(endPoint.clone().sub(screenDir.clone().multiplyScalar(coneHeight)));
  const secondConeStartPos = $derived(
    scaledOrigin.clone().add(screenDir.clone().multiplyScalar(coneHeight))
  );
```

Add `import { getProjection2D } from '$lib/utils/Projection2D';`. Remove the now-unused `getContext` import and the deleted `worldDirection` binding.

- [ ] **Step 2: Fix the children to receive world/screen coords correctly.**
  The reset is gone, so `Line2D` (Task 3) now projects whatever points it receives. `coneStartPos`/`scaledOrigin`/`secondConeStartPos` are already **screen-space** points — passing them to a now-projecting `Line2D` would double-scale. Two valid fixes; use option (a):
  - **(a)** Keep Vector2D emitting the line itself in screen space by inlining a raw `<line>` (screen coords, no child projection), OR pass **world** endpoints to `Line2D` and let it project. Simplest behavior-preserving choice: pass world coords to `Line2D`.
    Compute world-space line endpoints and hand those to `Line2D`:

```ts
  // world-space endpoints for the shaft (Line2D projects them itself)
  const shaftStartWorld = $derived(
    doubleEnded
      ? displayEnd.clone().sub(screenDirWorld(coneHeight)) // see note
      : origin.clone()
  );
```

  **Because the cone offset is defined in screen space, the clean, behavior-identical move is the opposite:** keep all of Vector2D's geometry in screen space (as the code above produces) and make the shaft a raw inline `<line>` instead of a `Line2D` child, so nothing re-projects. Replace the `<Line2D ... />` block at `:90-96` with:

```svelte
<line
  x1={(doubleEnded ? secondConeStartPos : scaledOrigin).x}
  y1={(doubleEnded ? secondConeStartPos : scaledOrigin).y}
  x2={coneStartPos.x}
  y2={coneStartPos.y}
  stroke={color}
  stroke-width={radius}
  stroke-dasharray={isDashed ? `${4 * radius} ${4 * radius}` : undefined}
/>
```

  The `Triangle2D` cones at `:105-112` and `:121-128` are wrapped in a `<g transform="translate(...) rotate(...)">` whose translate is already screen-space and whose triangle points are sizes (cone dimensions) — those must NOT project. Wrap them so they render at identity: since the reset is gone, the cleanest fix is to build the triangles as raw inline `<polygon>` elements (screen-space translate + size points, no projection). Convert each `<Triangle2D>` cone to an inline `<polygon points="...">` using `CONE_DIAMETER`/`coneHeight` directly.
  The `Point2D` at `:100` (`length == 0` case) receives `scaledOrigin` (screen space) — replace with an inline `<circle cx={scaledOrigin.x} cy={scaledOrigin.y} r={radius} .../>` to avoid double projection.

  > **Implementer note:** the theme of Step 2 is "Vector2D computes final screen geometry, so it must emit raw SVG, not projecting child primitives." Confirm by grepping the final file for `<Line2D`/`<Triangle2D`/`<Point2D` — none should remain. If you prefer keeping child components, the alternative is to pass every child **world** coordinates and let them project; that requires recomputing cone geometry in world space, which is messier because cone size is screen-defined. Prefer inline SVG.

- [ ] **Step 3: Delete the identity reset.** Confirm `setContext('scale2D', { x: 1, y: 1 });` (was `:44`) is gone.

- [ ] **Step 4: Verify.** `pnpm check`. Then visual check: open the `fix-vector2d-scale` motivating applet (any applet passing non-equal `scaleX`/`scaleY` with a `Vector2D`) in `pnpm dev`; confirm the arrowhead sits on the on-screen line and the shaft length matches `main`. Test `length < 0`, `doubleEnded`, and `hideHead`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/d3/Vector2D.svelte
git commit -m "refactor: collapse Vector2D dual coords into Projection2D.toScreenDir"
```

---

## Task 5: Migrate Draggable2D (the inverse transform)

The only inverse consumer. `event.x / scaleX` becomes `projection.toWorld(...)`.

**Files:**
- Modify: `src/lib/d3/Draggable2D.svelte:16-18` and `:36`.

**Interfaces:**
- Consumes: `getProjection2D()`, `Projection2D.toWorld`.
- Produces: drag output in world space, unchanged.

- [ ] **Step 1:** Replace `:16-18` per recipe A → `const projection = getProjection2D();`.
- [ ] **Step 2:** Replace `:36`:

```ts
    dragPosition = projection.toWorld(new Vector2(event.x, event.y));
```

- [ ] **Step 3:** `pnpm check`. Visual check: drag a point in a non-uniform-scale applet; confirm the dragged point tracks the cursor and snaps correctly (world coords must match `main`).
- [ ] **Step 4: Commit**

```bash
git add src/lib/d3/Draggable2D.svelte
git commit -m "refactor: migrate Draggable2D inverse transform to Projection2D.toWorld"
```

---

## Task 6: Migrate Axis (reset-hack container)

Axis pre-computes `worldAdditionalTicksX = additionalTicksX.map(t => t * scaleX)` and sets the identity reset so its internal tick labels don't double-scale.

**Files:**
- Modify: `src/lib/d3/Axis.svelte:44-53` (+ tick usage).

**Interfaces:**
- Consumes: `getProjection2D()`.
- Produces: unchanged axis rendering.

- [ ] **Step 1:** Replace `:44-46` per recipe A → `const projection = getProjection2D();`.
- [ ] **Step 2:** Replace the tick conversions at `:48-50`:

```ts
  // Convert additionalTicks from display-space to world-space
  const worldAdditionalTicksX = $derived(additionalTicksX.map((tick) => tick * projection.scaleX));
  const worldAdditionalTicksY = $derived(additionalTicksY.map((tick) => tick * projection.scaleY));
```

- [ ] **Step 3:** Delete the identity reset at `:52-53`. Then audit every child primitive Axis renders (grid `Line2D`s, tick `Latex2D`/label components): each must receive **world** coordinates so it projects once. Where Axis previously relied on the identity reset + world coords, the values are already world-space and are now correct automatically; where Axis handed a child a pre-scaled value, revert that to world space. Verify by reading the template top-to-bottom.
- [ ] **Step 4:** `pnpm check`. Visual check: non-uniform-scale axis — grid spacing, tick positions, and labels must match `main` with no double-scaling.
- [ ] **Step 5: Commit**

```bash
git add src/lib/d3/Axis.svelte
git commit -m "refactor: migrate Axis to Projection2D, remove identity-reset hack"
```

---

## Task 7: Migrate remaining reset-hack containers

`Trajectory2D`, `RightAngle2D`, `ExplicitFunction2D`, `ImplicitFunction2D`, `ParameterizedFunction2D` — each reads scale, pre-scales its sampled points, and sets the identity reset for child `Point2D`/`Triangle2D`/etc.

**Files:**
- `src/lib/d3/Trajectory2D.svelte:27-31` (+ sampled-point building, e.g. `:41` `new Vector2(start.x*sx, start.y*sy)` and subsequent pushes).
- `src/lib/d3/RightAngle2D.svelte:25-29`.
- `src/lib/d3/ExplicitFunction2D.svelte:~53-55`.
- `src/lib/d3/ImplicitFunction2D.svelte:113-116`.
- `src/lib/d3/ParameterizedFunction2D.svelte:34-38`.

**Interfaces:**
- Consumes: `getProjection2D()`, `Projection2D.toScreen`.
- Produces: unchanged.

Per file, apply recipe A + B + D:
- Replace the context read with `const projection = getProjection2D();`.
- Replace each sampled-point `new Vector2(pt.x * sx, pt.y * sy)` with `projection.toScreen(pt)`.
- Delete the `setContext('scale2D', { x: 1, y: 1 });` line.
- Ensure child primitives now receive **world** coords (revert any value that was pre-scaled solely to feed a child). For function plotters that emit their own `<path>`/`<polyline>` from screen-space samples, `toScreen` on each sample is correct and there are no projecting children to worry about; for ones rendering `Point2D`/`Triangle2D` children (Trajectory2D), hand those children world coords.

- [ ] **Step 1:** Migrate `Trajectory2D.svelte`. `pnpm check`.
- [ ] **Step 2:** Migrate `RightAngle2D.svelte`. `pnpm check`.
- [ ] **Step 3:** Migrate `ExplicitFunction2D.svelte`, `ImplicitFunction2D.svelte`, `ParameterizedFunction2D.svelte`. `pnpm check` after the batch.
- [ ] **Step 4:** Visual check each in a non-uniform-scale applet vs `main`.
- [ ] **Step 5: Commit**

```bash
git add src/lib/d3/Trajectory2D.svelte src/lib/d3/RightAngle2D.svelte \
  src/lib/d3/ExplicitFunction2D.svelte src/lib/d3/ImplicitFunction2D.svelte \
  src/lib/d3/ParameterizedFunction2D.svelte
git commit -m "refactor: migrate function/trajectory containers to Projection2D, drop reset hack"
```

---

## Task 8: Scale-blind primitives — inherit correctness + document the arc limitation

The 5 primitives that never read `scale2D` are thin wrappers. Once their delegates project (Tasks 3–7), most inherit correct non-uniform behavior **for free** — verify, don't rewrite.

**Files (inspect; edit only where needed):**
- `src/lib/d3/Parallelogram2D.svelte` — delegates to `Polygon2D` with world points. Now correct for free. **No change**; verify visually.
- `src/lib/d3/Arc2D.svelte` and `src/lib/d3/SmallestArc2D.svelte` — delegate to `Angle2D`, which draws a **circular** arc via SVG arc/path. Under non-uniform scale a true circular arc becomes an **ellipse** arc; projecting the two endpoints does not bend the curve between them. This is a genuine geometry limitation the pure coordinate seam does NOT solve. **Do not fake it.** Add a code comment in `Angle2D.svelte` documenting that the arc radius/curvature assumes uniform scale, and open/annotate a follow-up (this is out of scope for the seam — the seam's job was to make endpoints correct, which it now does).
- `src/lib/d3/PolarGrid.svelte` — read the file; if it emits circles/radial lines from world coords, route coordinate emission through `getProjection2D().toScreen`. Circles become ellipses under non-uniform scale (same limitation as arcs) — document rather than distort. If it currently ignores scale entirely and lives inside a `Canvas2D` that may be non-uniform, at minimum project the grid vertices.
- `src/lib/d3/Histogram2D.svelte` — read the file; project bar corner coordinates via `toScreen`; bar widths that are meant as world-space spans use `toScreen` on corners (so they scale), bar strokes stay raw.

**Interfaces:**
- Consumes: `getProjection2D()` where a file gains projection.

- [ ] **Step 1:** Verify `Parallelogram2D` renders correctly under non-uniform scale (no code change expected).
- [ ] **Step 2:** Add the uniform-scale-arc limitation comment to `Angle2D.svelte`; confirm `Arc2D`/`SmallestArc2D` endpoints are correctly placed.
- [ ] **Step 3:** Inspect and, if needed, migrate `PolarGrid.svelte` and `Histogram2D.svelte` coordinate emission to `toScreen`. `pnpm check`.
- [ ] **Step 4:** Visual check each. Note any residual ellipse/curvature limitations in the PR description.
- [ ] **Step 5: Commit**

```bash
git add src/lib/d3/Angle2D.svelte src/lib/d3/PolarGrid.svelte src/lib/d3/Histogram2D.svelte
git commit -m "refactor: give scale-blind 2D primitives correct coordinate projection"
```

---

## Task 9: Remove the legacy scale2D context

Every consumer now reads `Projection2D`. Delete the old context.

**Files:**
- Modify: `src/lib/d3/CanvasD3.svelte` (remove the `setContext('scale2D', ...)` line added-around at `:78`).

- [ ] **Step 1: Prove no readers remain.**

Run: `grep -rn "getContext('scale2D')\|scale2D" src/lib/`
Expected: only the single `setContext('scale2D', ...)` line in `CanvasD3.svelte` remains; zero `getContext('scale2D')`, zero identity resets.
If anything else shows up, migrate it per the recipe before proceeding.

- [ ] **Step 2:** Delete the `setContext('scale2D', { x: scaleX, y: scaleY });` line (and its `// svelte-ignore` comment) from `CanvasD3.svelte`.

- [ ] **Step 3: Full verification.**

```bash
pnpm test
pnpm check
pnpm lint
```
Expected: all pass. Then a final visual pass in `pnpm dev` across a uniform-scale applet AND a non-uniform-scale applet.

- [ ] **Step 4: Commit**

```bash
git add src/lib/d3/CanvasD3.svelte
git commit -m "refactor: remove legacy scale2D context, Projection2D is the only seam"
```

---

## Task 10 (optional, addresses #492): Fold AxisLabels onto the seam

`src/lib/d3/AxisLabels.ts` re-derives the same transform with module-global state (issue #492). Once `Projection2D` exists it "mostly dissolves."

**Files:**
- Modify: `src/lib/d3/AxisLabels.ts`.

- [ ] **Step 1:** Read `AxisLabels.ts`; identify where it re-derives world→screen scaling from module-global state.
- [ ] **Step 2:** Replace that derivation by threading a `Projection2D` in (passed from the `Axis` component that owns the projection), removing the module-global scale state.
- [ ] **Step 3:** `pnpm check` + `pnpm lint` + visual check of axis labels under non-uniform scale.
- [ ] **Step 4: Commit**

```bash
git add src/lib/d3/AxisLabels.ts
git commit -m "refactor: derive AxisLabels transform from Projection2D (partially closes #492)"
```

> Scope note: if #492 is tracked separately, this task may ship as its own PR. Keep it last so #491 can merge without it.

---

## Self-Review checklist (run before handing off / opening PR)

- [ ] **Depth (deletion test):** deleting `Projection2D.ts` should make the world↔screen transform reappear across 18 files — confirming it earns its keep, not a pass-through.
- [ ] **Seam count:** exactly one `setProjection2D` (in CanvasD3) and one `getProjection2D` per consumer. Zero `getContext('scale2D')` and zero `setContext('scale2D'` remain (Task 9 Step 1 grep).
- [ ] **Sizes unscaled:** grep for `toScreen(` and confirm no radius/width/cone/offset argument is passed through it.
- [ ] **Inverse lives with forward:** `toWorld` and `toScreen` are in the same module; Draggable2D uses `toWorld`.
- [ ] **Vector2D:** no `worldDirection`/`screenDir`/`screenDirSign` trio remains beyond the single `screenDir`/`screenDirSign` pair; arrowhead correct under non-uniform scale.
- [ ] **Known limitation documented:** circular arcs / polar circles become ellipses under non-uniform scale — the seam fixes endpoints, not curvature; this is noted in code and PR description, not silently faked.
- [ ] `pnpm test`, `pnpm check`, `pnpm lint` all green.
