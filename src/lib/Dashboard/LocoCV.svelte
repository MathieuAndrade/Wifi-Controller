<script lang="js">
  import {
    ws,
    cvId,
    event,
    locos,
    selectedLoco,
    indexOfSelectedLoco,
    hasDataToSave,
    powerState,
  } from '../../utils/store';

  import _ from '../../utils/i18n';
  import { range, toHex, toBin, sortByKey } from '../../utils/utils';
  import message from '../../utils/messages';

  import Icons from '../Icons/Icons.svelte';
  import CheckboxGroup from '../Checkbox/CheckboxGroup.svelte';
  import CvButton from './CvButton.svelte';

  let loco = {};
  let start = 1;
  let end = 10;
  let cv29State = [];
  let cv29Bit = 0;
  let cvVol = 63;
  let vol = 0;
  let shortAddress = null;
  let longAddress = null;

  selectedLoco.subscribe((value) => {
    loco = value ? value : {}; // On first run value can be undefined

    if (!loco.cvs) {
      loco.cvs = []; // Force initialization for first run
    } else {
      // Init cv29
      let cv29Index = loco.cvs.findIndex((c) => c.id === 29);
      if (cv29Index !== -1) {
        cv29Bit = Number(loco.cvs[cv29Index].value || 0);
        cv29State = Array.from(toBin(cv29Bit), (x) => Number(x)).reverse();
      } else {
        cv29Bit = 0;
        cv29State = [];
      }

      // Init long/short address
      let cv17Index = loco.cvs.findIndex((c) => c.id === 17);
      let cv18Index = loco.cvs.findIndex((c) => c.id === 18);
      if (cv17Index !== -1 && cv18Index !== -1) {
        longAddress = loco.address;
        shortAddress = null;
      } else {
        longAddress = null;
        shortAddress = loco.address;
      }
    }
  });

  event.on('dccMessage', (data) => {
    if (data.includes(`<r${cvId}|${cvId}|`)) {
      // <rID|ID|cv value>
      const cv = parseInt(data.split('|')[2].split(' ')[0]);
      let value = parseInt(data.split(' ')[1].replace('>', ''));
      value = value === -1 ? 0 : value;

      // If cv already exist, update his value
      if (loco.cvs.some((c) => c.id === cv)) {
        let index = loco.cvs.findIndex((c) => c.id === cv);
        loco.cvs[index].value = value;
      } else {
        loco.cvs.push({
          id: cv,
          defaultValue: '',
          value: value,
        });

        // Sort list if necessary
        loco.cvs = sortByKey(loco.cvs, 'id');
      }

      if (cv === 29) {
        let cv29Index = loco.cvs.findIndex((c) => c.id === 29);
        cv29Bit = Number(loco.cvs[cv29Index].value || 0);
        cv29State = Array.from(toBin(cv29Bit), (x) => Number(x)).reverse();
      }

      if (cv === 18) {
        let cv17Index = loco.cvs.findIndex((c) => c.id === 17);
        let cv18Index = loco.cvs.findIndex((c) => c.id === 18);

        longAddress =
          (loco.cvs[cv17Index].value - 192) * 256 + loco.cvs[cv18Index].value;
        loco.address = longAddress;
      }

      // Finally save to list
      onSave();
    }
  });

  /** Generic functions */

  const onSave = () => {
    locos.update((value) => {
      const list = value;
      list[indexOfSelectedLoco] = loco;
      return list;
    });

    selectedLoco.set(loco);
    hasDataToSave.set(true);
  };

  const saveCv = (cv, value) => {
    // If volume cv does not existt in list, create it
    if (!loco.cvs.some((c) => c.id === cv)) {
      loco.cvs.push({
        id: cv,
        cv: cv,
        defaultValue: '',
        value: value,
      });

      // Sort list if necessary
      loco.cvs = sortByKey(loco.cvs, 'id');
    } else {
      let index = loco.cvs.findIndex((c) => c.id === cv);
      loco.cvs[index].value = value;
    }

    onSave();
  };

  const readCvs = (list) => {
    let interval = 3000;
    let increment = 1;

    list.forEach((cv) => {
      const runner = setTimeout(() => {
        $ws.send(message.readCv(cv, cvId));

        clearTimeout(runner);
      }, interval * increment);

      increment = increment + 1;
    });
  };

  const onRead = (value) => {
    if ($powerState) {
      readCvs([value]);
    }
  };

  const onWrite = (list) => {
    if ($powerState) {
      let interval = 3000;
      let increment = 1;

      list.forEach((cv) => {
        const runner = setTimeout(() => {
          let index = loco.cvs.findIndex((c) => c.id === cv);
          $ws.send(message.writeCv(cv, loco.cvs[index].value, cvId));

          clearTimeout(runner);
        }, interval * increment);

        increment = increment + 1;
      });
    }
  };

  /** Change handlers */

  const onReadMulitple = () => {
    if ($powerState && start <= end) {
      readCvs(range(start, end));
    }
  };

  const onCv29Change = () => {
    if ($powerState) {
      let value = 0;

      for (let i = 0; i <= 7; i += 1) {
        value += cv29State[i] ? 2 ** i : 0;
      }

      saveCv(29, value);

      let index = loco.cvs.findIndex((c) => c.id === 29);
      cv29Bit = loco.cvs[index].value;
    }
  };

  /** Write handlers */

  const setShortAddress = () => {
    if ($powerState) {
      saveCv(1, shortAddress);

      cv29State[5] = 0;
      loco.address = shortAddress;

      // Write cv 29, 1 interval of 3s
      onCv29Change();
      setTimeout(onWrite, 3000, [1]);
    }
  };

  const setLongAddress = () => {
    if ($powerState) {
      let cv17 = Math.floor(longAddress / 256) + 192;
      let cv18 = Number(longAddress % 256);

      saveCv(17, cv17);
      saveCv(18, cv18);

      cv29State[5] = 1;
      loco.address = longAddress;

      // Write cv 29, 17, 18 with interval of 3s
      onCv29Change();
      setTimeout(onWrite, 3000, [17, 18]);
    }
  };

  const setVolume = () => {
    if ($powerState && cvVol && cvVol !== 0 && cvVol !== -1) {
      writeCv([...cvVol]);
      saveCv(cvVol, vol);
    }
  };

  //TODO: Adresse UM
</script>

<div
  class="collapse border rounded-box border-base-300 collapse-arrow
  {!$selectedLoco.address && 'collapse-close'}">
  <input type="checkbox" checked />
  <div class="collapse-title text-xl font-medium">
    {#if $selectedLoco && $selectedLoco.shortName}
      {$_('locoCV')} : {$selectedLoco.shortName}
    {:else if $selectedLoco && $selectedLoco.longName}
      {$_('locoCV')} : {$selectedLoco.longName}
    {:else}
      {$_('locoNotSelected')}
    {/if}
  </div>

  <div class="collapse-content">
    <div class="flex flex-row space-x-7 my-5 text-left">
      <div class="flex-auto">
        <span class="text-lg underline underline-offset-4">
          {$_('cv29Config')}
        </span>

        <CheckboxGroup
          data="{{
            value: cv29State,
            onChange: onCv29Change,
            labels: [
              `${$_('bit0')}`,
              `${$_('bit1')}`,
              `${$_('bit2')}`,
              `${$_('bit3')}`,
              `${$_('bit4')}`,
              `${$_('bit5')}`,
              `${$_('bit6')}`,
              `${$_('bit7')}`,
            ],
          }}" />

        <div class="flex text-center mt-3">
          <span class="mx-9">CV 29 : {cv29Bit}</span>

          <CvButton
            hideText="{false}"
            onReadClick="{() => readCvs([29])}"
            onWriteClick="{() => onWrite([29])}" />
        </div>
      </div>

      <div class="divider divider-vertical"></div>

      <div class="flex-auto flex flex-col space-y-7">
        <span class="text-lg underline underline-offset-4">
          {$_('various')}
        </span>

        <div
          class="flex flex-wrap items-center justify-center lg:justify-start">
          <label class="w-32" for="vol">Volume: CV :</label>

          <input
            class="input input-ghost input-bordered input-sm w-20 mx-2"
            type="number"
            name="vol"
            id="vol"
            bind:value="{cvVol}" />

          <div class="inline-flex items-center">
            <input
              class="range mx-2"
              type="range"
              max="100"
              bind:value="{vol}" />

            <span class="w-7">{vol}</span>
          </div>

          <CvButton
            cssClass="mt-2 lg:m-0"
            hideText="{false}"
            onReadClick="{() => readCvs([...cvVol])}"
            onWriteClick="{setVolume}" />
        </div>

        <div
          class="flex flex-wrap items-center justify-center lg:justify-start">
          <label class="w-32" for="short-address"
            >{$_('shortAddress')} :
          </label>

          <input
            id="short-address"
            name="short-address"
            class="input input-ghost input-bordered input-sm w-20 mx-2"
            type="number"
            min="0"
            max="127"
            bind:value="{shortAddress}" />

          <CvButton
            cssClass="mt-2 lg:m-0"
            hideText="{false}"
            onReadClick="{() => readCvs([1, 29])}"
            onWriteClick="{setShortAddress}" />
        </div>

        <div
          class="flex flex-wrap items-center justify-center lg:justify-start">
          <label class="w-32" for="um-address">{$_('umAddress')} : </label>

          <input
            class="input input-ghost input-bordered input-sm w-20 mx-2"
            type="number"
            min="0"
            max="127"
            name="um-address"
            id="um-address" />

          <CvButton
            cssClass="mt-2 lg:m-0"
            hideText="{false}"
            onReadClick="{() => {}}"
            onWriteClick="{() => {}}" />
        </div>

        <div
          class="flex flex-wrap items-center justify-center lg:justify-start">
          <label class="w-32" for="long-address">{$_('longAddress')} : </label>

          <input
            class="input input-ghost input-bordered input-sm w-20 mx-2"
            type="number"
            name="long-address"
            id="long-address"
            bind:value="{longAddress}" />

          <CvButton
            cssClass="mt-2 lg:m-0"
            hideText="{false}"
            onReadClick="{() => readCvs([17, 18, 29])}"
            onWriteClick="{setLongAddress}" />
        </div>
      </div>
    </div>

    <div class="divider">{$_('cvList')}</div>

    <div>
      <span class="text-lg underline underline-offset-4 mb-5">
        {$_('readGroupOfCv')}
      </span>

      <div class="flex flex-row items-center justify-between my-5">
        <label for="start">{$_('start')}:</label>

        <input
          class="input input-ghost input-bordered input-sm max-w-xs"
          type="number"
          name="start"
          id="start"
          min="0"
          max="512"
          bind:value="{start}" />

        <label for="end">{$_('end')}:</label>

        <input
          class="input input-ghost input-bordered input-sm max-w-xs"
          type="number"
          name="end"
          id="end"
          min="0"
          max="512"
          bind:value="{end}" />

        <div class="tooltip lg:hidden" data-tip="{$_('readGroupOfCvNote')}">
          <Icons cssClass="inline-block w-5 mr-2" icon="help" />
        </div>

        <span class="hidden lg:block">
          {$_('readGroupOfCvNote')}
        </span>

        <button
          class="btn btn-outline btn-xs btn-info mr-2"
          on:click|preventDefault="{onReadMulitple}">
          <Icons cssClass="inline-block w-5 mr-2" icon="play" />
          {$_('startRead')}
        </button>
      </div>
    </div>

    <table class="table w-full table-compact text-center">
      <thead>
        <tr>
          <th class="w-16">{$_('cv')}</th>
          <th class="w-32 md:w-80 lg:w-auto">{$_('label')}</th>
          <th class="w-20 md:w-80 lg:w-auto">{$_('defaultValue')}</th>
          <th class="w-20 md:w-80 lg:w-auto">
            {$_('currentValue')} ({$_('dec')})
          </th>
          <th class="hidden xl:table-cell">
            {$_('currentValue')} ({$_('hex')})
          </th>
          <th class="hidden 2xl:table-cell">
            {$_('currentValue')} ({$_('bin')})
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each loco.cvs as cv}
          <tr>
            <th>{cv.id}</th>
            <td class="truncate">
              {#if $_(`cv${cv.id}`) !== `cv${cv.id}`}
                {$_(`cv${cv.id}`)}
              {/if}
            </td>
            <td>
              <input
                class="input input-ghost input-bordered input-sm w-32 lg:w-auto"
                type="number"
                name="cv-{cv.id}-default-value"
                id="cv-{cv.id}-default-value"
                bind:value="{cv.defaultValue}"
                on:input="{onSave}" />
            </td>
            <td>
              <input
                class="input input-ghost input-bordered input-sm w-32 lg:w-auto"
                type="number"
                name="cv-{cv.id}-current-value"
                id="cv-{cv.id}-current-value"
                bind:value="{cv.value}"
                on:input="{onSave}" />
            </td>
            <td class="hidden xl:table-cell">{toHex(cv.value)}</td>
            <td class="hidden 2xl:table-cell">{toBin(cv.value)}</td>
            <td>
              <CvButton
                onReadClick="{() => onRead(cv.id)}"
                onWriteClick="{() => onWrite(cv.id)}" />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
