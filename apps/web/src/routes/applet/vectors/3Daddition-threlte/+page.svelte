<script lang="ts">
  import { Vector3 } from 'three';
  import {
    Axis3D,
    Canvas3D,
    Equation3D,
    PartialDeconstruction3D,
    Vector3D
  } from 'threlte-components';

  import { PrimeColor } from 'utils/PrimeColors';
  import { HTML } from '@threlte/extras';

  // Vectors
  const v1 = new Vector3(-1, 2, 2); //green vector
  const v2 = new Vector3(3, 3, 1); //blue vector
  const v3 = v1.clone().add(v2); //red vector

  const labelPosScalar = 0.25;
</script>

<Canvas3D title="Geometrical interpretation of addition for three-dimensional vectors.">
  <!-- lower green vector -->
  <Vector3D direction={v1} color={PrimeColor.green} length={v1.length()} />
  <Equation3D
    position={v1.clone().add(v1.clone().normalize().multiplyScalar(labelPosScalar))}
    s={'\\begin{bmatrix} ' + v1.x + ' \\\\ ' + v1.z + ' \\\\ ' + v1.y + ' \\end{bmatrix}'}
  />
  <PartialDeconstruction3D p={v1} color={PrimeColor.green} showAxisPoints />

  <!-- upper green vector -->
  <Vector3D direction={v1} origin={v2} color={PrimeColor.green} length={v1.length()} />

  <!-- blue vector -->
  <Vector3D direction={v2} color={PrimeColor.ultramarine} length={v2.length()} />
  <!-- TODO: label -->
  <PartialDeconstruction3D p={v2} color={PrimeColor.ultramarine} showAxisPoints />

  <!-- red vector -->
  <Vector3D direction={v3} color={PrimeColor.red} length={v3.length()} />
  <!-- TODO: label -->
  <PartialDeconstruction3D p={v3} color={PrimeColor.red} showAxisPoints />

  <Axis3D showNumbers />
</Canvas3D>
