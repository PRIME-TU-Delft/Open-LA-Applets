<script lang="ts" module>
  import { Vector2 } from 'three';

  export type Surface3DProps = {
    func: (x: number, y: number) => number;
    xRange?: [number, number];
    yRange?: [number, number];
    polygon?: Vector2[];
    internalPoints?: Vector2[];

    resolution?: number;

    color?: string;
    opacity?: number;
    wireframe?: boolean;
    surface?: boolean;
    wireColor?: string;
  };
</script>

<script lang="ts">
  import { T } from '@threlte/core';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  import { BufferAttribute, BufferGeometry, DoubleSide } from 'three';

  import cdt2d from 'cdt2d';

  type Point = [number, number];

  let {
    func,
    xRange = [-5, 5],
    yRange = [-5, 5],
    polygon = [],
    internalPoints = [],
    resolution = 40,
    color = PrimeColor.blue,
    opacity = 0.7,
    wireframe = false,
    surface = wireframe ? false : true,
    wireColor = color
  }: Surface3DProps = $props();

  function pointInPolygon(point: Vector2, polygon: Vector2[]): boolean {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;

      const xj = polygon[j].x;
      const yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  function subdivideBoundary(polygon: Vector2[], resolution: number): Vector2[] {
    const result: Vector2[] = [];

    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];

      for (let k = 0; k < resolution; k++) {
        const t = k / resolution;

        result.push(new Vector2(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y)));
      }
    }

    return result;
  }

  function averageEdgeLength(polygon: Vector2[]): number {
    let total = 0;

    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];

      total += Math.hypot(b.x - a.x, b.y - a.y);
    }

    return total / polygon.length;
  }

  function encroaches(p: Vector2, a: Vector2, b: Vector2): boolean {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;

    const radius2 = ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) / 4;

    const dist2 = (p.x - mx) ** 2 + (p.y - my) ** 2;

    return dist2 < radius2;
  }

  type Edge = [number, number];

  function findEncroachedEdge(points: Vector2[], edges: Edge[], candidate: Vector2): boolean {
    for (const edge of edges) {
      const [i1, i2] = edge;

      const p1 = points[i1];
      const p2 = points[i2];

      if (encroaches(candidate, p1, p2)) {
        return true;
      }
    }

    return false;
  }

  const geometry = $derived.by(() => {
    // build locally instead of mutating the (possibly shared/cached) polygon prop default
    const activePolygon =
      polygon.length === 0
        ? [
            new Vector2(xRange[0], yRange[0]),
            new Vector2(xRange[1], yRange[0]),
            new Vector2(xRange[1], yRange[1]),
            new Vector2(xRange[0], yRange[1])
          ]
        : polygon;

    if (activePolygon.length < 3) {
      return new BufferGeometry();
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const p of activePolygon) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);

      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    const points: Vector2[] = [];

    // --------------------------------------------------
    // Boundary subdivision
    // --------------------------------------------------

    points.push(...subdivideBoundary(activePolygon, resolution));

    const edges: Edge[] = [];
    for (let iter = 0; iter < points.length; iter++) {
      edges.push([iter, (iter + 1) % points.length]);
    }

    // --------------------------------------------------
    // Add required internal points
    // --------------------------------------------------

    for (const p of internalPoints) {
      points.push(p);
    }

    // --------------------------------------------------
    // Hexagonal interior sampling
    // --------------------------------------------------

    const avgEdge = averageEdgeLength(activePolygon);

    const spacing = avgEdge / resolution;

    const dx = spacing;
    const dy = (spacing * Math.sqrt(3)) / 2;

    let row = 0;

    for (let y = minY; y <= maxY; y += dy, row++) {
      const offset = row % 2 === 0 ? 0 : dx / 2;

      for (let x = minX + offset; x <= maxX; x += dx) {
        const p = new Vector2(x, y);
        let InPoints = false;
        for (const q of points) {
          const dist = p.clone().sub(q).length();
          if (dist < 0.01 * avgEdge) {
            InPoints = true;
          }
          if (InPoints) {
            break;
          }
        }
        if (!InPoints) {
          if (pointInPolygon(p, activePolygon)) {
            const nearEdge = findEncroachedEdge(points, edges, p);
            if (!nearEdge) {
              points.push(p);
            }
          }
        }
      }
    }

    // --------------------------------------------------
    // Delaunay triangulation
    // --------------------------------------------------

    // make the points "flat"
    const flatPoints: Point[] = [];
    for (const p of points) {
      flatPoints.push([p.x, p.y]);
    }

    const triangles = cdt2d(flatPoints, edges, { exterior: false });

    const vertices: number[] = [];

    for (const p of points) {
      vertices.push(p.x, p.y, func(p.x, p.y));
    }

    const indices: number[] = [];

    for (const t of triangles) {
      indices.push(t[0], t[1], t[2]);
    }

    const geom = new BufferGeometry();

    geom.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));

    geom.setIndex(indices);

    geom.computeVertexNormals();

    return geom;
  });
</script>

{#if surface}
  <T.Mesh {geometry} rotation={[(Math.PI / 2) * -1, 0, (Math.PI / 2) * -1]}>
    <T.MeshBasicMaterial {color} transparent={opacity < 1} {opacity} side={DoubleSide} />
  </T.Mesh>
{/if}

{#if wireframe}
  <T.Mesh {geometry} rotation={[(Math.PI / 2) * -1, 0, (Math.PI / 2) * -1]}>
    <T.MeshBasicMaterial color={wireColor} {wireframe} />
  </T.Mesh>
{/if}
