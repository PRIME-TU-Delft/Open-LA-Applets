// src/types/cdt2d.d.ts

declare module 'cdt2d' {
    interface Cdt2dOptions {
        delaunay?: boolean;
        exterior?: boolean;
        interior?: boolean;
        infinity?: boolean;
    }

    export default function cdt2d(
        points: number[][],
        edges?: number[][],
        options?: Cdt2dOptions
    ): number[][];
}