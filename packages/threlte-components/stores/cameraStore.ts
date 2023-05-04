import { writable } from 'svelte/store';
import type { OrthographicCamera } from 'three';

export default writable<OrthographicCamera>();
