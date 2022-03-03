<script lang="js">
  import { powerState } from '../utils/store';
  import 'canvas-gauges';

  export let mode = 'dashboard';
  export let speed;
  export let onSpeedChange;

  const scale = mode === 'dashboard' ? 320 : 200;
  const centerX = mode === 'dashboard' ? 160 : 100;
  const centerY = mode === 'dashboard' ? 170 : 110;
  const dimensions = mode === 'dashboard' ? 320 : 200;

  const onClick = (e) => {
    if (!$powerState) return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    const theta = Math.atan2(y, x) + Math.PI;
    let thetaRad = (theta * 180) / Math.PI;

    // Ignore canvas's base
    if (thetaRad < 290 && thetaRad > 240) {
      return;
    }

    if (thetaRad <= 320 && thetaRad >= 300) {
      // Set tolerance for min speed
      thetaRad = 315;
    } else if (thetaRad >= 220 && thetaRad <= 240) {
      // Set tolerance for max speed
      thetaRad = 225;
    }

    // Normalize angle
    if (thetaRad > 300) {
      thetaRad = thetaRad - 360 + 45;
    } else {
      thetaRad += 45;
    }

    speed = Math.round((thetaRad * 160) / 270);
    onSpeedChange();
  };
</script>

<canvas
  id="throttleSpeedGauge"
  data-type="radial-gauge"
  data-width="{dimensions}"
  data-height="{dimensions}"
  data-title="DCC"
  data-color-title="#FFFFFF"
  data-font-numbers-size="15"
  data-min-value="0"
  data-max-value="160"
  data-major-ticks="0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160"
  data-minor-ticks="10"
  data-stroke-ticks="true"
  data-units="km/h"
  data-value-box="true"
  data-value="{speed}"
  data-value-dec="0"
  data-glow="true"
  data-animation-rule="dequad"
  data-animation="{false}"
  data-color-plate="#4C4E4F"
  data-color-needle="#FF0000"
  data-color-needle-end="#FF0000"
  data-color-major-ticks="#00CCFF"
  data-color-minor-ticks="#FFFFFF"
  data-color-numbers="#00CCFF"
  data-highlights="{'[{ "from":0,   "to": 120, "color": "#706050" },{ "from":120, "to": 140, "color": "#FFA000" },{ "from":140, "to": 160, "color": "#D04040" }]'}"
  on:click|preventDefault="{onClick}"
>
</canvas>
