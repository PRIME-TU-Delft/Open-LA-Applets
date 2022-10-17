# Vector

Vector is a 3D component that represents a vector in 3D space.

| Prop               | Type    | Default               | Description                                                                                                                      |
| ------------------ | ------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| color              | string  | getRandomColor        | The color of the vector                                                                                                          |
| origin             | Vector3 | new Vector3(0, 0, 0)  | The origin of the vector                                                                                                         |
| direction          | Vector3 | new Vector3(1, 0, 0)  | The direction of the vector, the length of this direction will be **normalised**                                                 |
| length             | number  | 1                     | The length of the vector                                                                                                         |
| radius             | number  | 0.05                  | The radius / thicccness of the vector                                                                                            |
| coneHeight         | number  | min(0.5, length / 10) | The height of the cone at the end of the vector, the total length will be computed in such a way that it will sum to length prop |
| showDeconstruction | boolean | false                 | If true, will show a striped box arround the vector to see how it will cross other parts of the scene                            |
| label              | string  | undefined             | The label of the vector, if undefined, will not show a label, for more info see [Label docs](/3d-components/label)               |

## Deconstruction
