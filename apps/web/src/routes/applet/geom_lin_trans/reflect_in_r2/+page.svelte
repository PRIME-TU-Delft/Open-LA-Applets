<script lang="ts">
  import { Axis2D, Canvas2D, Latex2D, Line2D, Point2D, Vector2D } from 'p5-components';

  import { GridType } from 'p5-components/components/Grids';
  import { Matrix3, Vector2 } from 'three';
  import { PrimeColor } from 'utils/PrimeColors';

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
  <Axis2D gridType={GridType.squareGrid} />

  <Line2D
    start={new Vector2(-10, -10)}
    end={new Vector2(10, 10)}
    color={PrimeColor.ultramarine}
    width={2}
  />

  {#each u_ts as ut, index}
    <Vector2D
      origin={ut.u}
      direction={ut.ut.clone().sub(ut.u)}
      length={ut.u.clone().sub(ut.ut).length()}
      color={PrimeColor.ultramarine}
      isDashed
    />

    <Point2D position={ut.u} color={PrimeColor.red} radius={10} />
    <Latex2D
      latex={`\\vec{u_${index + 1}}`}
      position={ut.u}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.red}
    />

    <Point2D position={ut.ut} color={PrimeColor.ultramarine} radius={10} isSquare />
    <Latex2D
      latex={`R(\\vec{u_${index + 1}})`}
      position={ut.ut}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.ultramarine}
    />
  {/each}
</Canvas2D>
