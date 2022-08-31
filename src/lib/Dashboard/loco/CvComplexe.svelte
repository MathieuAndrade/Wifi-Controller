<script lang="js">
  import _ from '../../../utils/i18n.js';

  import {
    ws,
    cvId,
    selectedLoco,
    powerState,
    addToast,
  } from '../../../utils/store';
  import { findCvValue, toBin } from '../../../utils/utils.js';
  import message from '../../../utils/messages';

  import CvButton from './CvButton.svelte';

  let loco = {};
  let runners = [];
  let locoAddress = 0;
  let cv17 = 0;
  let cv18 = 0;
  let cv29State = [0, 0, 0, 0, 0, 0, 0, 0];
  let cv29Bit = 0;

  selectedLoco.subscribe((value) => {
    loco = value ? value : {}; // On first run, value can be undefined
    locoAddress = loco.address || 0;

    if (!loco.cvs) {
      loco.cvs = []; // Force initialization for first run
    }

    if (loco.address > 128) {
      cv17 = findCvValue(loco.cvs, 17);
      cv18 = findCvValue(loco.cvs, 18);
    }

    // Init Cv 29
    cv29State = [];
    cv29Bit = findCvValue(loco.cvs, 29);
    let cv29BinArr = Array.from(toBin(cv29Bit), (x) => Number(x)).reverse();

    for (let i = 0; i <= cv29BinArr.length - 1; i += 1) {
      cv29State.push(cv29BinArr[i] ? 2 ** i : 0);
    }
  });

  const readCvs = (list) => {
    let interval = 3000;
    let increment = 1;

    list.forEach((cv) => {
      runners.push(
        setTimeout(() => {
          $ws.send(message.readCv(cv, cvId));

          clearTimeout(runners[0]);
        }, interval * increment),
      );

      increment = increment + 1;
    });
  };

  const onRead = (value) => {
    if ($powerState) {
      readCvs(Array.isArray(value) ? value : [value]);
    } else {
      addToast('warning', "L'alimentation est coupé");
    }
  };

  const onWrite = (list, values) => {
    if ($powerState) {
      let interval = 3000;
      let increment = 1;

      list.forEach((cv, index) => {
        const runner = setTimeout(() => {
          $ws.send(message.writeCv(cv, values[index], cvId));

          clearTimeout(runner);
        }, interval * increment);

        increment = increment + 1;
      });
    } else {
      addToast('warning', "L'alimentation est coupé");
    }
  };

  const onLongAddressChange = () => {
    if (locoAddress > 128) {
      cv17 = Math.floor(locoAddress / 256) + 192;
      cv18 = locoAddress - (cv17 - 192) * 256;
    }
  };

  const onCv29Change2 = () => {
    cv29Bit = 0;
    for (let i = 0; i <= cv29State.length - 1; i += 1) {
      cv29Bit += cv29State[i];
    }
  };
</script>

<div>
  <p class="text-center">
    {$_('cvComplexeDescription')}
  </p>
  <br />

  <!-- CV17 & CV18 -->
  <div class="divider font-extrabold">CV17 & CV18</div>

  <div class="max-w-5xl mx-auto flex">
    <div class="grow flex flex-row gap-4 items-center">
      <label class="w-32" for="long-address">{$_('longAddress')} : </label>

      <input
        class="input input-ghost input-bordered input-sm w-24 mx-2"
        type="number"
        name="long-address"
        id="long-address"
        bind:value="{locoAddress}"
        on:change="{onLongAddressChange}" />

      <span class="label-text">{$_('results')} -> </span>
      <span class="label-text font-bold">CV17 : {cv17}</span>
      <span class="label-text font-bold">CV18 : {cv18}</span>
    </div>

    <CvButton
      onReadClick="{() => onRead([17, 18])}"
      onWriteClick="{() => onWrite([17, 18], [cv17, cv18])}" />
  </div>

  <!-- CV21 & CV22 -->
  <!--
  <div class="divider font-extrabold">CV21 & CV22</div>

  <div class="card-body max-w-5xl mx-auto">
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <CvButton />
    </div>
  </div>
  -->

  <!-- CV29 -->
  <div class="divider font-extrabold">CV29</div>

  <div class="max-w-5xl mx-auto flex flex-col gap-3">
    <div>
      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">
          {$_('cv29Bit1Title')}
        </h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="direction"
            class="radio radio-sm"
            bind:group="{cv29State[0]}"
            on:change="{onCv29Change2}"
            value="{0}" />

          <span class="label-text">
            {$_('cv29Bit1On')}
          </span>
        </label>

        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="direction"
            class="radio radio-sm"
            bind:group="{cv29State[0]}"
            on:change="{onCv29Change2}"
            value="{1}" />

          <span class="label-text">
            {$_('cv29Bit1Off')}
          </span>
        </label>
      </div>

      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">{$_('cv29Bit2Title')}</h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="speed-step"
            class="radio radio-sm"
            bind:group="{cv29State[1]}"
            on:change="{onCv29Change2}"
            value="{2}" />

          <span class="label-text">
            {$_('cv29Bit2On')}
          </span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="speed-step"
            class="radio radio-sm"
            bind:group="{cv29State[1]}"
            on:change="{onCv29Change2}"
            value="{0}" />

          <span class="label-text">
            {$_('cv29Bit2Off')}
          </span>
        </label>
      </div>

      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">{$_('cv29Bit3Title')}</h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="digital-mode"
            class="radio radio-sm"
            bind:group="{cv29State[2]}"
            on:change="{onCv29Change2}"
            value="{4}" />

          <span class="label-text">
            {$_('cv29Bit3On')}
          </span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="digital-mode"
            class="radio radio-sm"
            bind:group="{cv29State[2]}"
            on:change="{onCv29Change2}"
            value="{0}" />

          <span class="label-text">
            {$_('cv29Bit3Off')}
          </span>
        </label>
      </div>

      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">{$_('cv29Bit4Title')}</h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="railcom"
            class="radio radio-sm"
            bind:group="{cv29State[3]}"
            on:change="{onCv29Change2}"
            value="{8}" />

          <span class="label-text"> {$_('cv29Bit4On')} </span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="railcom"
            class="radio radio-sm"
            bind:group="{cv29State[3]}"
            on:change="{onCv29Change2}"
            value="{0}" />

          <span class="label-text"> {$_('cv29Bit4Off')} </span>
        </label>
      </div>

      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">{$_('cv29Bit5Title')}</h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="speed-table"
            class="radio radio-sm"
            bind:group="{cv29State[4]}"
            on:change="{onCv29Change2}"
            value="{16}" />

          <span class="label-text">
            {$_('cv29Bit5On')}
          </span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="speed-table"
            class="radio radio-sm"
            bind:group="{cv29State[4]}"
            on:change="{onCv29Change2}"
            value="{0}" />

          <span class="label-text">
            {$_('cv29Bit5Off')}
          </span>
        </label>
      </div>

      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">{$_('cv29Bit6Title')}</h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="address-type"
            class="radio radio-sm"
            bind:group="{cv29State[5]}"
            on:change="{onCv29Change2}"
            value="{0}" />

          <span class="label-text">
            {$_('cv29Bit6Off')}
          </span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="address-type"
            class="radio radio-sm"
            bind:group="{cv29State[5]}"
            on:change="{onCv29Change2}"
            value="{32}" />

          <span class="label-text">
            {$_('cv29Bit6On')}
          </span>
        </label>
      </div>

      <!--
      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">Bit 6 (Not used)</h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="bit-6"
            class="radio radio-sm"
            bind:group={cv29State[6]}
            on:change={onCv29Change2}
            value={64} />
          <span class="label-text">
            On
          </span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="bit-6"
            class="radio radio-sm"
            bind:group={cv29State[6]}
            on:change={onCv29Change2}
            value={0} />
          <span class="label-text">
            Off
          </span>
        </label>
      </div>
        -->

      <!--
      <div class="form-control">
        <h4 class="my-1 font-semibold leading-6">Bit 7 (Not used)</h4>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="bit-7"
            class="radio radio-sm"
            bind:group={cv29State[7]}
            on:change={onCv29Change2}
            value={128} />
          <span class="label-text">
            On
          </span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="radio"
            name="bit-7"
            class="radio radio-sm"
            bind:group={cv29State[7]}
            on:change={onCv29Change2}
            value={0} />
          <span class="label-text">
            Off
          </span>
        </label>
      </div>
        -->
    </div>

    <div class="grow flex flex-row justify-between">
      <span class="mx-9 font-bold">
        Résultat CV 29 : {cv29Bit}
      </span>
      <CvButton
        onReadClick="{() => onRead(29)}"
        onWriteClick="{() => onWrite([29], [cv29Bit])}" />
    </div>
  </div>

  <!-- CV33-46 Function Mapping -->
  <!--
  <div class="divider font-extrabold">CV33-46 Function Mapping</div>

  <div class="card-body max-w-5xl mx-auto">
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <CvButton />
    </div>
  </div>
  -->

  <!-- CV61 -->
  <!--
  <div class="divider font-extrabold">CV61</div>

  <div class="card-body max-w-5xl mx-auto">
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <CvButton />
    </div>
  </div>
  -->

  <!-- CV62 -->
  <!--
  <div class="divider font-extrabold">CV62</div>

  <div class="card-body max-w-5xl mx-auto">
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <CvButton />
    </div>
  </div>
  -->

  <!-- CV63 -->
  <!--
  <div class="divider font-extrabold">CV63</div>

  <div class="card-body max-w-5xl mx-auto">
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <CvButton />
    </div>
  </div>
  -->

  <!--
  <iframe
    src="https://www.digitrax.com/support/cv/calculators/"
    title=""
    frameborder="0"
    class="h-screen w-full mt-5">
  </iframe>
  -->
</div>
