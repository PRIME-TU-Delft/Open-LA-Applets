<script lang="ts" module>
  import { Vector2 } from 'three';

  export type Surface3DProps = {
    func: (x: number, y: number) => number;
    xRange?: [number, number];
    yRange?: [number, number];
    polygon?: Vector2[];

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

  import Delaunator from 'delaunator';

  let {
    func,
    xRange = [-5, 5],
    yRange = [-5, 5],
    polygon = [],
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

  function triangleCentroid(a: Vector2, b: Vector2, c: Vector2): Vector2 {
    return new Vector2((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3);
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

  const geometry = $derived.by(() => {
    if (polygon.length === 0) {
      // no polygon, so assume rectangular based on (default) xRange and yRange
      polygon.push(new Vector2(xRange[0], yRange[0]));
      polygon.push(new Vector2(xRange[1], yRange[0]));
      polygon.push(new Vector2(xRange[1], yRange[1]));
      polygon.push(new Vector2(xRange[0], yRange[1]));
    }

    if (polygon.length < 3) {
      return new BufferGeometry();
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const p of polygon) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);

      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    const points: Vector2[] = [];

    // --------------------------------------------------
    // Boundary subdivision
    // --------------------------------------------------

    points.push(...subdivideBoundary(polygon, resolution));

    // --------------------------------------------------
    // Hexagonal interior sampling
    // --------------------------------------------------

    const avgEdge = averageEdgeLength(polygon);

    const spacing = avgEdge / resolution;

    const dx = spacing;
    const dy = (spacing * Math.sqrt(3)) / 2;

    let row = 0;

    for (let y = minY; y <= maxY; y += dy, row++) {
      const offset = row % 2 === 0 ? 0 : dx / 2;

      for (let x = minX + offset; x <= maxX; x += dx) {
        const p = new Vector2(x, y);

        if (pointInPolygon(p, polygon)) {
          points.push(p);
        }
      }
    }

    // --------------------------------------------------
    // Delaunay triangulation
    // --------------------------------------------------

    const delaunay = Delaunator.from(
      points,
      (p: Vector2) => p.x,
      (p: Vector2) => p.y
    );

    const vertices: number[] = [];

    for (const p of points) {
      vertices.push(p.x, p.y, func(p.x, p.y));
    }

    const indices: number[] = [];

    const tris = delaunay.triangles;

    for (let i = 0; i < tris.length; i += 3) {
      const ia = tris[i];
      const ib = tris[i + 1];
      const ic = tris[i + 2];

      const a = points[ia];
      const b = points[ib];
      const c = points[ic];

      const centroid = triangleCentroid(a, b, c);

      if (pointInPolygon(centroid, polygon)) {
        indices.push(ia, ib, ic);
      }
    }

    const geom = new BufferGeometry();

    geom.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));

    geom.setIndex(indices);

    geom.computeVertexNormals();

    return geom;
  });
</script>

{#if surface}
  <T.Mesh {geometry} rotation={[-Math.PI / 2, 0, 0]}>
    <T.MeshBasicMaterial {color} transparent={opacity < 1} {opacity} side={DoubleSide} />
  </T.Mesh>
{/if}

{#if wireframe}
  <T.Mesh {geometry} rotation={[-Math.PI / 2, 0, 0]}>
    <T.MeshBasicMaterial
      color={wireColor}
      // transparent={opacity < 1}
      // {opacity}
      side={DoubleSide}
      {wireframe}
    />
  </T.Mesh>
{/if}
