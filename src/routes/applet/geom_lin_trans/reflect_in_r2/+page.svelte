<script lang="ts">
  import { Canvas2D, Latex2D, Line2D, Point2D, Vector2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2 } from 'three';

  const us = [
    new Vector2(2, 3.5),
    new Vector2(1, -2),
    new Vector2(-2, -1),
    new Vector2(2, 0)
  ] as const;

  const m = new Matrix3();
  m.set(0, 1, 0, 1, 0, 0, 0, 0, 1);

  const u_ts = us.map((u) => {
    const ut = u.clone().applyMatrix3(m);
    return { u, ut };
  });
</script>

<Canvas2D>
  <Line2D start={new Vector2(-10, -10)} end={new Vector2(10, 10)} color={PrimeColor.ultramarine} />

  {#each u_ts as ut, index}
    <Vector2D
      origin={ut.u}
      direction={ut.ut.clone().sub(ut.u)}
      length={ut.u.clone().sub(ut.ut).length()}
      color={PrimeColor.ultramarine}
      isDashed
    />

    <Point2D position={ut.u} color={PrimeColor.red} pulse />
    <Latex2D
      latex={`\\mathbf{u}_${index + 1}`}
      position={ut.u}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.red}
    />

    <Point2D position={ut.ut} color={PrimeColor.ultramarine} isSquare pulse />
    <Latex2D
      latex={`R(\\mathbf{u}_${index + 1})`}
      position={ut.ut}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.ultramarine}
    />
  {/each}
</Canvas2D>
