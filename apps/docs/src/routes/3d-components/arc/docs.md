# Arc

Arc is a 3D component that represents a slice of a sphere in 3D space, drawn between the tips of two given points. Vectors are assumed to have the same origin.

In case of an angle of 180 degrees, the plane on which to draw the arc cannot be calculated, so another vector must be given. That vector is u. When an angle that is originally not 180 degrees becomes 180 degrees, a previous point on the arc is used, so u only has to be specified if the originally drawn arc is 180 degrees.

A detailed explanation of used math can be found in Open LA book Teams -> developers interactivity -> files -> cirkelboog.pdf 

note: As of right now the arc becomes visually inconsitent when using a slider to increase and decrease around 180 degrees

| Prop               | Type    | Default               | Description                                                                                                                      |
| ------------------ | ------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| points  | [Vector3, Vector3] |        none | The vectors to draw an arc between. |                                                                                         |
| origin             | Vector3 | Vector3(0, 0, 0)  | The origin of the vectors between which an arc will be drawn  |    
| pointsOnArc | number | 15 | The desired number of points to be calculated on the arc.|
| color              | string  | black       | The color of the arc     |                                                                                                                                                      
| label              | string  | undefined             | The label of the vector, if undefined, will not show a label, for more info see [Label docs](/3d-components/label)               |
| u | Vector3 |  Vector3(0, 1, 0) | In case of an angle of 180 degrees, the plane on which to draw the arc cannot be calculated, so another vector must be given. That vector is u.