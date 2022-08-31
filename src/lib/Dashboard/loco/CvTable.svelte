<script lang="js">
  import Icon from '@iconify/svelte';

  import {
    ws,
    cvId,
    locos,
    selectedLoco,
    indexOfSelectedLoco,
    hasDataToSave,
    powerState,
    addToast,
  } from '../../../utils/store';

  import _ from '../../../utils/i18n';
  import { range, toHex, toBin } from '../../../utils/utils';
  import message from '../../../utils/messages';

  import CvButton from './CvButton.svelte';

  let loco = {};
  let start = 1;
  let end = 10;
  let runners = [];
  let cvToRead = 1;
  let cvToReadValue = 1;

  selectedLoco.subscribe((value) => {
    loco = value ? value : {}; // On first run value can be undefined

    if (!loco.cvs) {
      loco.cvs = []; // Force initialization for first run
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
      readCvs([value]);
    } else {
      addToast('warning', 'L\'alimentation est coupé');
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
    } else {
      addToast('warning', 'L\'alimentation est coupé');
    }
  };

  /** Change handlers */

  const onReadMulitple = () => {
    if ($powerState && start <= end) {
      readCvs(range(start, end));
    } else {
      addToast('warning', 'L\'alimentation est coupé');
    }
  };

  const onStopReadMulitple = () => {
    runners.forEach((runner) => {
      clearTimeout(runner);
    });
  };

  const onCvToReadChange = () => {
    // If cv already exist, get his value
    if (loco.cvs.some((c) => c.id === cvToRead)) {
      let index = loco.cvs.findIndex((c) => c.id === cvToRead);
      cvToReadValue = loco.cvs[index].value;
    }
  };
</script>

<div class="flex flex-col xl:flex-row xl:justify-evenly">
  <div>
    <span class="text-lg underline underline-offset-4 mb-5">
      {$_('editSpecificCv')}
    </span>

    <div class="flex flex-row items-center gap-3 my-5">
      <label for="start">{$_('cv')}:</label>

      <input
        class="input input-ghost input-bordered input-sm max-w-xs"
        type="number"
        name="cvToRead"
        id="cvToRead"
        min="0"
        max="512"
        bind:value="{cvToRead}"
        on:change="{onCvToReadChange}" />

      <label for="start">{$_('value')}:</label>

      <input
        class="input input-ghost input-bordered input-sm max-w-xs"
        type="number"
        name="cvToReadValue"
        id="cvToReadValue"
        min="0"
        max="255"
        bind:value="{cvToReadValue}" />

      <CvButton
        onReadClick="{() => onRead(cvToRead)}"
        onWriteClick="{() => onWrite([cvToRead])}" />
    </div>
  </div>

  <div>
    <span class="text-lg underline underline-offset-4 mb-5">
      {$_('readGroupOfCv')}
    </span>

    <div class="flex flex-row items-center gap-3 my-5">
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

      <div class="tooltip" data-tip="{$_('readGroupOfCvNote')}">
        <Icon icon="ic:round-help-outline" class="w-5 h-5 mr-2" />
      </div>

      <button
        class="btn btn-outline btn-xs btn-error mr-0 lg:mr-2"
        on:click|preventDefault="{onStopReadMulitple}">
        <Icon icon="ic:outline-stop-circle" class="w-5 h-5 mr-2" />
        {$_('stop')}
      </button>

      <button
        class="btn btn-outline btn-xs btn-info mr-0 lg:mr-2"
        on:click|preventDefault="{onReadMulitple}">
        <Icon icon="ic:outline-play-circle" class="w-5 h-5 mr-2" />
        {$_('starting')}
      </button>
    </div>
  </div>
</div>

<div>
  <span class="text-lg underline underline-offset-4 mb-5"> {$_('cvList')} </span>

  <table class="table w-full table-compact text-center my-5">
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
              onWriteClick="{() => onWrite([cv.id])}" />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
