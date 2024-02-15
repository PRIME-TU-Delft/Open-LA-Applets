import DraggableCanvas from './CanvasWithDraggables.svelte';

export default {
  title: 'Tutorial/Draggables',
  component: DraggableCanvas
};

export const SimpleExample = {
  args: {
    title: 'Simple example with two draggable vertices'
  }
};

export const SnapExample = {
  args: {
    title: 'Two draggable vertices that snap to a grid',
    snap: true
  }
};
