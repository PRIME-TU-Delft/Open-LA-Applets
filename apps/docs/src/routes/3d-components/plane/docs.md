# Planes

A plane can be defined in countless ways. We have choosen to use 2 ways:

- Defined by one central point in 3d space and a vector pointing towards the normal **Red plane**
- Defined by 3 distict points **Blue plane**

Both types are explained below.

## Plane from Normal

| Prop          | Type          | Default                 | Description                                                           |
| ------------- | ------------- | ----------------------- | --------------------------------------------------------------------- |
| point         | Vector        | new Vector(0,0,0)       | Center point of the plane                                             |
| normal        | Vector        | new Vector(1,1,1)       | Normal of the plane from the persepective of the center point         |
| color         | string        | getRandomColor          | Color of the plane                                                    |
| size          | number        | 10                      | Both Width and Height of plane                                        |
| opacity       | number        | 0.8                     | Opacity of planes                                                     |
| planeSegments | PlaneSegments | PlaneSegments.default() | How plane is formatted into sections. This is explained further below |

## Plane from Points

| Prop          | Type                        | Default                                                      | Description                                                           |
| ------------- | --------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| points        | [Vector3, Vector3, Vector3] | [new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1)] | Points of the plane (must be unique)                                  |
| color         | string                      | getRandomColor                                               | Color of the plane                                                    |
| opacity       | number                      | 0.8                                                          | Opacity of planes                                                     |
| planeSegments | PlaneSegments               | PlaneSegments.default()                                      | How plane is formatted into sections. This is explained further below |

## Plane segments

> This is still work in progress, expect changes in the future

A segemented plane is mustly used to show 1 or more planes are colliding. This is done by splitting the plane into sections. The sections are then colored differently to show the collision.

| Argument  | Type                     | Description                                |
| --------- | ------------------------ | ------------------------------------------ |
| segements | number                   | Number of sections the plane is split into |
| offset    | number                   | Offset of the sections                     |
| interval  | number                   | Interval of the sections                   |
| direction | 'horizontal', 'vertical' | Direction of the sections                  |

### Example code of two planes colliding

```svelte
<PlaneFromNormal planeSegment="{new PlaneSegments(32, 0, 2)}" color="{PrimeColor.red}" />

<PlaneFromNormal planeSegment="{new PlaneSegments(32, 1, 2)}" color="{PrimeColor.yellow}" />
```

These planes have 32 segments each, alternating between red and yellow. The first plane has an offset of 0, meaning the first segment is red. The offset of the yellow plane means it will shift all segeents by 1,
