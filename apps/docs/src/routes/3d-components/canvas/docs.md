# Canvas

Canvas is a component that allows you to render 3D content using threejs. It is a wrapper around the [three.js](https://threejs.org/) library.

### Props

| Prop      | Type     | Default | Description                                                                                     |
| --------- | -------- | ------- | ----------------------------------------------------------------------------------------------- |
| --height  | css var  | 100vh   | The height of the canvas                                                                        |
| autoPlay  | boolean  | false   | If the canvas should automatically start playing                                                |
| enablePan | boolean  | false   | If the canvas should allow panning                                                              |
| disableUI | boolean  | false   | If the canvas should disable the UI, usefull for taking screenshots of the canvas               |
| sliders   | Slider[] | []      | An array of sliders that can be used to control variables in the scene, this is explained below |

### Slot props

| Prop         | Type     | Default | Description                                                                                     |
| ------------ | -------- | ------- | ----------------------------------------------------------------------------------------------- |
| sliderValues | number[] | []      | An array of numbers that can be used to control variables in the scene, this is explained below |

### ActionButtons

The bottom right is populated with action buttons. These buttons are in order from top to bottom:

- Play/Pause
- Settings
- Reset camera
- Toggle fullscreen

### Sliders

A slider is an object that describes variables of a scene that can be controlled by the user. We recommend to keep the amount of sliders to a minimum, as it can be confusing for the user and clutters the UI. The slider object has the following properties:

| Prop         | Type   | Default                | Description                                                                                      |
| ------------ | ------ | ---------------------- | ------------------------------------------------------------------------------------------------ |
| defaultValue | number | 0                      | The starting position of the slider                                                              |
| min          | number | 0                      | The minimum value of the slider                                                                  |
| max          | number | 1                      | The maximum value of the slider                                                                  |
| step         | number | 0.1                    | The step size of the slider                                                                      |
| color        | string | PrimeColor.ultramarine | The color of the slider, indecated to a user what the expected element would be that is changing |

An example of a slider would be the following:

```js
let sliders = [
  new Slider(1, 0, 2, 0.1, PrimeColor.green), // A slider that has start 1, min 0, max 2, step 0.1 and color PrimeColor.ultramarine
  new Slider(0, 0, 1, 0.5).yellow() // A slider that has start 0, min 0, max 1, step 0.5 and color PrimeColor.yellow
];
```

To reset all sliders to their default value, you can use the `resetSliders` method on the slider

```js
function resetSliders() {
  sliders = sliders.map((s) => s.reset());
}
```

This same logic is called when the user clicks the reset button in the UI.

### Examples [WIP]

<!-- - [Basic Canvas with sliders - WIP](#) -->

- Sliders
- Basic Canvas
