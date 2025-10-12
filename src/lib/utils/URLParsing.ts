import { globalState } from '$lib/stores/globalState.svelte';
import { locale } from 'svelte-i18n';
import { Vector2, Vector3 } from 'three';

type Params2D = {
  position2D: Vector2;
  zoom2D: number;
};

type Params3D = {
  position3D: Vector3;
  zoom3D: number;
};

/**
 * This function is used to parse the URL and set the global state accordingly. Parses `title=[STRING]` and `iframe=[ANY]` parameters.
 * @param searchParams The URLSearchParams object that contains the URL parameters.
 */
export function handleGlobalState(searchParams: URLSearchParams) {
  if (searchParams.has('iframe')) {
    globalState.inIframe = true;
  }

  if (searchParams.has('title')) {
    globalState.title = searchParams.get('title') ?? '';
  }

  if (searchParams.has('lang')) {
    locale.set(searchParams.get('lang'));
  }
}

function parse2dParams(searchParams: URLSearchParams, split = false): Partial<Params2D> {
  const prefix = split ? 'split-' : '';
  const params: Partial<Params2D> = {};

  if (searchParams.has(prefix + 'position2D') || searchParams.has(prefix + 'position2d')) {
    const position = (
      searchParams.get(prefix + 'position2D') ?? searchParams.get(prefix + 'position2d')
    )
      ?.split(',')
      .map(Number) as [number, number];

    if (position.length !== 2) {
      throw new Error('Invalid position2D parameter');
    }
    if (position.some(isNaN)) {
      throw new Error('Invalid position2D parameter');
    }

    params.position2D = new Vector2(position[0], position[1]);
  }

  if (searchParams.has(prefix + 'zoom2D') || searchParams.has(prefix + 'zoom2d')) {
    const zoom = Number(searchParams.get(prefix + 'zoom2D') ?? searchParams.get(prefix + 'zoom2d'));
    if (isNaN(zoom)) {
      throw new Error('Invalid zoom2D parameter');
    }

    params.zoom2D = zoom;
  }

  return params;
}

function parse3dParams(searchParams: URLSearchParams, split = false) {
  const prefix = split ? 'split-' : '';
  const params: Partial<Params3D> = {};

  if (searchParams.has(prefix + 'position3D') || searchParams.has(prefix + 'position3d')) {
    const position = (
      searchParams.get(prefix + 'position3D') ?? searchParams.get(prefix + 'position3d')
    )
      ?.split(',')
      .map(Number) as [number, number, number];

    if (position.length !== 3) {
      throw new Error('Invalid position3D parameter');
    }
    if (position.some(isNaN)) {
      throw new Error('Invalid position3D parameter');
    }

    params.position3D = new Vector3(position[0], position[1], position[2]);
  }

  if (searchParams.has(prefix + 'zoom3D') || searchParams.has(prefix + 'zoom3d')) {
    const zoom = Number(searchParams.get(prefix + 'zoom3D') ?? searchParams.get(prefix + 'zoom3d'));
    if (isNaN(zoom)) {
      throw new Error('Invalid zoom3D parameter');
    }

    params.zoom3D = zoom;
  }

  return params;
}

export function parseUrl(searchParams: URLSearchParams) {
  handleGlobalState(searchParams);

  return {
    params2D: parse2dParams(searchParams),
    params3D: parse3dParams(searchParams),
    paramsSplit2D: parse2dParams(searchParams, true),
    paramsSplit3D: parse3dParams(searchParams, true)
  };
}
