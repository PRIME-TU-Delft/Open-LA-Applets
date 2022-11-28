import { Camera, Matrix4, Object3D, Scene, Vector3 } from 'three';

class CSS2DObject extends Object3D<Event> {
  element: HTMLElement;
  isCSS2DObject = true;
  type = 'CSS2DObject';

  constructor(element = document.createElement('div')) {
    super();

    this.element = element;

    this.element.style.position = 'absolute';
    this.element.style.userSelect = 'none';

    this.addEventListener('removed', () => {
      this.traverseScene();
    });
  }

  traverseScene() {
    this.traverse((object: Object3D) => {
      console.log(object);
      if (object.element instanceof Element && object.element.parentNode !== null) {
        object.element.parentNode.removeChild(object.element);
      }
    });
  }
}

//

const _vector = new Vector3();
const _viewMatrix = new Matrix4();
const _viewProjectionMatrix = new Matrix4();
const _a = new Vector3();
const _b = new Vector3();

interface CSS2DRendererElement {
  element?: HTMLElement;
}

class CSS2DRenderer {
  domElement: HTMLElement;

  _width: number;
  _height: number;
  _widthHalf: number;
  _heightHalf: number;

  cache = {
    objects: new WeakMap()
  };

  constructor(parameters: CSS2DRendererElement = {}) {
    this._width = window?.innerWidth || 0;
    this._height = window?.innerWidth || 0;
    this._widthHalf = this._width / 2;
    this._heightHalf = this._height / 2;

    const domElement =
      parameters.element !== undefined ? parameters.element : document.createElement('div');

    domElement.style.overflow = 'hidden';

    this.domElement = domElement;
  }

  getSize() {
    return {
      width: this._width,
      height: this._height
    };
  }

  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;

    this._widthHalf = this._width / 2;
    this._heightHalf = this._height / 2;

    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';
  }

  getDistanceToSquared(object1: Object3D, object2: Object3D) {
    _a.setFromMatrixPosition(object1.matrixWorld);
    _b.setFromMatrixPosition(object2.matrixWorld);

    return _a.distanceToSquared(_b);
  }

  filterAndFlatten(scene: Scene) {
    const result: CSS2DObject[] = [];

    scene.traverse((object: Object3D) => {
      if (object.type == 'CSS2DObject' && object instanceof CSS2DObject) result.push(object);
    });

    return result;
  }

  zOrder(scene: Scene) {
    const sorted = this.filterAndFlatten(scene).sort((a, b) => {
      if (a.renderOrder !== b.renderOrder) {
        return b.renderOrder - a.renderOrder;
      }

      const distanceA = this.cache.objects.get(a).distanceToCameraSquared;
      const distanceB = this.cache.objects.get(b).distanceToCameraSquared;

      return distanceA - distanceB;
    });

    const zMax = sorted.length;

    for (let i = 0, l = sorted.length; i < l; i++) {
      sorted[i].element.style.zIndex = (zMax - i).toString();
    }
  }

  renderObject(object: Object3D, scene: Scene, camera: Camera) {
    if ('isCSS2DObject' in object && object instanceof CSS2DObject) {
      _vector.setFromMatrixPosition(object.matrixWorld);
      _vector.applyMatrix4(_viewProjectionMatrix);

      const visible =
        object.visible === true &&
        _vector.z >= -1 &&
        _vector.z <= 1 &&
        object.layers.test(camera.layers) === true;
      object.element.style.display = visible === true ? '' : 'none';

      if (visible === true) {
        object.onBeforeRender(this, scene, camera);

        const element = object.element;

        element.style.transform =
          'translate(-50%,-50%) translate(' +
          (_vector.x * this._widthHalf + this._widthHalf) +
          'px,' +
          (-_vector.y * this._heightHalf + this._heightHalf) +
          'px)';

        if (element.parentNode !== this.domElement) {
          this.domElement.appendChild(element);
        }

        object.onAfterRender(this, scene, camera);
      }

      const objectData = {
        distanceToCameraSquared: this.getDistanceToSquared(camera, object)
      };

      this.cache.objects.set(object, objectData);
    }

    for (let i = 0, l = object.children.length; i < l; i++) {
      this.renderObject(object.children[i], scene, camera);
    }
  }

  render(scene: Scene, camera: Camera) {
    if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld();
    if (camera.parent === null && camera.matrixWorldAutoUpdate === true) camera.updateMatrixWorld();

    _viewMatrix.copy(camera.matrixWorldInverse);
    _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, _viewMatrix);

    this.renderObject(scene, scene, camera);
    this.zOrder(scene);
  }
}

export { CSS2DObject, CSS2DRenderer };
