<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Dropdown } from '$lib/controls/Dropdown.svelte';
  import { Slider } from '$lib/controls/Slider.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const rules: string[] = [
    'applets.vectors.rules.rule_1',
    'applets.vectors.rules.rule_2',
    'applets.vectors.rules.rule_3',
    'applets.vectors.rules.rule_4',
    'applets.vectors.rules.rule_5',
    'applets.vectors.rules.rule_6',
    'applets.vectors.rules.rule_7',
    'applets.vectors.rules.rule_8'
  ];

  const d = new Dropdown(rules[0], rules);
  const s1 = new Slider(1.5, -5, 5, 0.5, PrimeColor.blue, 'c1', false, (x) =>
    round(x, 1).toString()
  );
  const s2 = new Slider(1.5, -5, 5, 0.5, PrimeColor.cyan, 'c2', false, (x) =>
    round(x, 1).toString()
  );

  const controls = $derived.by(() => {
    if (d.value == 'applets.vectors.rules.rule_6') {
      return Controls.add(d).add(s1);
    }

    if (d.value == 'applets.vectors.rules.rule_7' || d.value == 'applets.vectors.rules.rule_8') {
      return Controls.add(d).add(s1).add(s2);
    }

    return Controls.add(d);
  });

  const dropdown = $derived(controls[0]);
  const slider1 = $derived(controls[1]) as number;
  const slider2 = $derived(controls[2]) as number;

  const draggables = $derived.by(() => {
    const draggables = [
      new Draggable(new Vector2(2, 3), PrimeColor.raspberry, '\\mathbf{v_1}', (v) =>
        v.length() < 0.5 ? new Vector2(0, 0) : v
      ),
      new Draggable(new Vector2(3, 2), PrimeColor.darkGreen, '\\mathbf{v_2}', (v) =>
        v.length() < 0.5 ? new Vector2(0, 0) : v
      ),
      new Draggable(new Vector2(1, -3), PrimeColor.yellow, '\\mathbf{v_3}', (v) =>
        v.length() < 0.5 ? new Vector2(0, 0) : v
      )
    ];

    switch (dropdown) {
      case 'applets.vectors.rules.rule_1':
      case 'applets.vectors.rules.rule_4':
      case 'applets.vectors.rules.rule_5':
      case 'applets.vectors.rules.rule_7':
      case 'applets.vectors.rules.rule_8':
        return [draggables[0]];
      case 'applets.vectors.rules.rule_3':
      case 'applets.vectors.rules.rule_6':
        return [draggables[0], draggables[1]];
      case 'applets.vectors.rules.rule_2':
        return draggables;
      default:
        return draggables;
    }
  });

  function toMatrix(vec: Vector2) {
    return `\\begin{pmatrix} ${round(vec.x, 1)} \\\\ ${round(vec.y, 1)} \\end{pmatrix}`;
  }

  function toColor(str: string, color: string) {
    return `\\textcolor{${color}}{${str}}`;
  }

  const formulas = $derived.by(() => {
    const zeroVec = '\\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}';
    const v1 = `\\begin{pmatrix} ${round(draggables[0].position.x, 1)} \\\\ ${round(draggables[0].position.y, 1)} \\end{pmatrix}`;
    const v2 = draggables[1] ? toMatrix(draggables[1].position) : '';
    const v3 = draggables[2] ? toMatrix(draggables[2].position) : '';

    switch (dropdown) {
      case 'applets.vectors.rules.rule_1':
        return [
          new Formula(`\\$1 + ${zeroVec} = \\$1 = ${zeroVec} + \\$1`).addAutoParam(
            v1,
            PrimeColor.raspberry
          )
        ];
      case 'applets.vectors.rules.rule_2':
        return [
          new Formula('( \\$1 + \\$2 ) + \\$3 = \\$1 + ( \\$2 + \\$3 ) = \\$4')
            .addAutoParam(v1, PrimeColor.raspberry)
            .addAutoParam(v2, PrimeColor.darkGreen)
            .addAutoParam(v3, PrimeColor.yellow)
            .addAutoParam(
              toMatrix(
                draggables[0].position
                  .clone()
                  .add(draggables[1].position)
                  .add(draggables[2].position)
              ),
              PrimeColor.black
            )
        ];
      case 'applets.vectors.rules.rule_3':
        return [
          new Formula(`\\$1 + \\$2 = \\$2 + \\$1 = \\$3`)
            .addAutoParam(v1, PrimeColor.raspberry)
            .addAutoParam(v2, PrimeColor.darkGreen)
            .addAutoParam(
              toMatrix(draggables[0].position.clone().add(draggables[1].position)),
              PrimeColor.black
            )
        ];
      case 'applets.vectors.rules.rule_4':
        return [new Formula(`\\$1 + (-\\$1) = ${zeroVec}`).addAutoParam(v1, PrimeColor.raspberry)];
      case 'applets.vectors.rules.rule_5':
        return [new Formula(`1\\$1 = \\$1`).addAutoParam(v1, PrimeColor.raspberry)];
      case 'applets.vectors.rules.rule_6':
        return [
          new Formula(`\\$3 \\cdot (\\$1 + \\$2) = \\$3 \\$1 + \\$3 \\$2 = \\$4`)
            .addAutoParam(v1, PrimeColor.raspberry)
            .addAutoParam(v2, PrimeColor.darkGreen)
            .addAutoParam(slider1, PrimeColor.blue)
            .addAutoParam(
              toMatrix(
                draggables[0].position.clone().add(draggables[1].position).multiplyScalar(slider1)
              ),
              PrimeColor.black
            )
        ];
      case 'applets.vectors.rules.rule_7':
        return [
          new Formula(`(\\$2 + \\$3) \\$1 = \\$2 \\$1 + \\$3 \\$1 = \\$4`)
            .addAutoParam(v1, PrimeColor.raspberry)
            .addAutoParam(slider1, PrimeColor.blue)
            .addAutoParam(slider2, PrimeColor.cyan)
            .addAutoParam(
              toMatrix(draggables[0].position.clone().multiplyScalar(slider1 + slider2)),
              PrimeColor.black
            )
        ];
      case 'applets.vectors.rules.rule_8':
        return [
          new Formula(`\\$2(\\$3) \\$1 = (\\$2*\\$3)\\$1 = \\$4`)
            .addAutoParam(v1, PrimeColor.raspberry)
            .addAutoParam(slider1, PrimeColor.blue)
            .addAutoParam(slider2, PrimeColor.cyan)
            .addAutoParam(
              toMatrix(draggables[0].position.clone().multiplyScalar(slider1 * slider2)),
              PrimeColor.black
            )
        ];
      default:
        return [];
    }
  });
</script>

<Canvas2D {controls} {draggables} {formulas}>
  {#each draggables as draggable (draggable.id)}
    <Vector2D
      direction={draggable.position}
      length={draggable.position.length()}
      color={draggable.color}
    />
  {/each}

  {#if dropdown == 'applets.vectors.rules.rule_2'}
    {@const v1Plusv2 = draggables[0].position.clone().add(draggables[1].position)}
    {@const v2Plusv3 = draggables[1].position.clone().add(draggables[2].position)}
    {@const v1Plusv2Plusv3 = v1Plusv2.clone().add(draggables[2].position)}

    <Vector2D
      direction={v1Plusv2Plusv3}
      length={v1Plusv2Plusv3.length()}
      color={PrimeColor.black + PrimeColor.opacity(0.7)}
    />

    <!-- v1 + v2  -->
    <Vector2D
      origin={draggables[0].position}
      direction={draggables[1].position}
      length={draggables[1].position.length()}
      color={PrimeColor.darkGreen}
      isDashed
    />
    <Point2D position={v1Plusv2} color={PrimeColor.black} />
    <Latex2D position={v1Plusv2} color={PrimeColor.black} latex={`\\mathbf{v_1} + \\mathbf{v_2}`} />

    <!-- v2 + v3 -->
    <Vector2D
      origin={draggables[1].position}
      direction={draggables[2].position}
      length={draggables[2].position.length()}
      color={PrimeColor.yellow}
      isDashed
    />
    <Point2D position={v2Plusv3} color={PrimeColor.black} />
    <Latex2D position={v2Plusv3} color={PrimeColor.black} latex={`\\mathbf{v_2} + \\mathbf{v_3}`} />

    <!-- v1 + v2 + v3 -->
    <Vector2D
      origin={v1Plusv2}
      direction={draggables[2].position}
      length={draggables[2].position.length()}
      color={PrimeColor.yellow}
      isDashed
    />
    <Vector2D
      origin={v2Plusv3}
      direction={draggables[0].position}
      length={draggables[0].position.length()}
      color={PrimeColor.raspberry}
      isDashed
    />

    <Point2D position={v1Plusv2Plusv3} color={PrimeColor.black} />
    <Latex2D
      position={v1Plusv2Plusv3}
      color={PrimeColor.black}
      latex={`\\mathbf{v_1} + \\mathbf{v_2} + \\mathbf{v_3}`}
    />
  {:else if dropdown == 'applets.vectors.rules.rule_3'}
    {@const v1Plusv2 = draggables[0].position.clone().add(draggables[1].position)}

    <Vector2D
      origin={draggables[0].position}
      direction={draggables[1].position}
      length={draggables[1].position.length()}
      color={PrimeColor.darkGreen}
      isDashed
    />

    <Vector2D
      origin={draggables[1].position}
      direction={draggables[0].position}
      length={draggables[0].position.length()}
      color={PrimeColor.raspberry}
      isDashed
    />

    <Vector2D
      direction={v1Plusv2}
      length={v1Plusv2.length()}
      color={PrimeColor.black + PrimeColor.opacity(0.7)}
    />

    <Point2D position={v1Plusv2} color={PrimeColor.black} />
    <Latex2D
      position={v1Plusv2}
      color={PrimeColor.black}
      latex={`\\mathbf{v_1} + \\mathbf{v_2} = \\mathbf{v_2} + \\mathbf{v_1}`}
    />
  {:else if dropdown == 'applets.vectors.rules.rule_4'}
    <Latex2D
      position={new Vector2(0.5, 0.5)}
      color={PrimeColor.black}
      latex={'\\mathbf{v_1} - \\mathbf{v_1} = \\mathbf{0}'}
    />
    <Vector2D
      origin={draggables[0].position}
      direction={draggables[0].position.clone().multiplyScalar(-1)}
      length={draggables[0].position.length()}
      color={PrimeColor.raspberry}
    />
  {:else if dropdown == 'applets.vectors.rules.rule_6'}
    {@const c1v1 = draggables[0].position.clone().multiplyScalar(slider1)}
    {@const c1v2 = draggables[1].position.clone().multiplyScalar(slider1)}
    {@const position = draggables[0].position.clone().add(draggables[1].position)}
    {@const c1v1Plusc1v2 = c1v1.clone().add(c1v2)}
    <Vector2D direction={position} length={position.length()} color={PrimeColor.black} />
    <Vector2D
      direction={c1v1Plusc1v2}
      length={c1v1Plusc1v2.length()}
      color={PrimeColor.black}
      isDashed
    />

    <Vector2D
      direction={draggables[0].position}
      length={slider1 * draggables[0].position.length()}
      color={PrimeColor.raspberry}
      isDashed
    />

    <Vector2D
      direction={draggables[1].position}
      length={slider1 * draggables[1].position.length()}
      color={PrimeColor.darkGreen}
      isDashed
    />

    <!-- c1(V1 + V2) -->
    <Vector2D
      origin={draggables[0].position}
      direction={draggables[1].position}
      length={draggables[1].position.length()}
      color={PrimeColor.darkGreen + PrimeColor.opacity(0.7)}
      isDashed
    />

    <Vector2D
      origin={draggables[1].position}
      direction={draggables[0].position}
      length={draggables[0].position.length()}
      color={PrimeColor.raspberry + PrimeColor.opacity(0.7)}
      isDashed
    />

    <!-- c1V1 + c1V2  -->
    <Vector2D
      origin={c1v1}
      direction={c1v2}
      length={c1v2.length()}
      color={PrimeColor.darkGreen + PrimeColor.opacity(0.7)}
      isDashed
    />

    <Vector2D
      origin={c1v2}
      direction={c1v1}
      length={c1v1.length()}
      color={PrimeColor.raspberry + PrimeColor.opacity(0.7)}
      isDashed
    />

    {#if slider1 != 1}
      <Latex2D latex={'\\mathbf{v_1} + \\mathbf{v_2}'} {position} color={PrimeColor.black} />

      <Latex2D
        latex={`${toColor('c_1', PrimeColor.blue)} \\mathbf{v_1}`}
        position={c1v1}
        color={PrimeColor.raspberry}
      />
      <Latex2D
        latex={`${toColor('c_1', PrimeColor.blue)} \\mathbf{v_2}`}
        position={c1v2}
        color={PrimeColor.darkGreen}
      />
    {/if}

    <Latex2D
      latex={`${toColor('c_1', PrimeColor.blue)} ( \\mathbf{v_1} + \\mathbf{v_2} ) = ${toColor('c_1', PrimeColor.blue)} \\mathbf{v_1} + ${toColor('c_1', PrimeColor.blue)} \\mathbf{v_2}`}
      position={c1v1Plusc1v2}
      color={PrimeColor.black}
    />
  {:else if dropdown == 'applets.vectors.rules.rule_7'}
    <Vector2D
      direction={draggables[0].position.clone().multiplyScalar(slider1)}
      length={draggables[0].position.length() * Math.abs(slider1)}
      color={PrimeColor.black}
      isDashed
    />

    <Vector2D
      origin={draggables[0].position.clone().multiplyScalar(slider1)}
      direction={draggables[0].position}
      length={slider2 * draggables[0].position.length()}
      color={PrimeColor.black}
      isDashed
    />

    {#if slider1 != 1 && slider2 != 1}
      <Point2D
        position={draggables[0].position.clone().multiplyScalar(slider1)}
        color={PrimeColor.black}
      />

      <Latex2D
        position={draggables[0].position.clone().multiplyScalar(slider1)}
        color={PrimeColor.black}
        latex={`${toColor('c_1', PrimeColor.blue)} \\mathbf{v_1}`}
      />

      <Point2D
        position={draggables[0].position.clone().multiplyScalar(slider1 + slider2)}
        color={PrimeColor.black}
      />

      <Latex2D
        position={draggables[0].position.clone().multiplyScalar(slider1 + slider2)}
        color={PrimeColor.black}
        latex={`${toColor('c_1', PrimeColor.blue)} \\mathbf{v_1} + ${toColor('c_2', PrimeColor.cyan)} \\mathbf{v_1}`}
      />
    {/if}
  {:else if dropdown == 'applets.vectors.rules.rule_8'}
    {@const position = draggables[0].position.clone().multiplyScalar(slider1 * slider2)}

    <Vector2D
      direction={position}
      length={position.length()}
      color={PrimeColor.black + PrimeColor.opacity(0.7)}
      isDashed
    />
    <Latex2D
      {position}
      color={PrimeColor.black}
      latex={`${toColor('c_2', PrimeColor.cyan)} ( ${toColor('c_1', PrimeColor.blue)} \\mathbf{v_1} ) = ( ${toColor('c_2', PrimeColor.cyan)} * ${toColor('c_1', PrimeColor.blue)} ) \\mathbf{v_1}`}
    />
  {/if}

  <!-- add black point if the zero vector is part of the formula -->
  {#if dropdown == 'applets.vectors.rules.rule_1' || dropdown == 'applets.vectors.rules.rule_4'}
    <Point2D position={new Vector2(0, 0)} color={PrimeColor.black} />
  {/if}
</Canvas2D>
