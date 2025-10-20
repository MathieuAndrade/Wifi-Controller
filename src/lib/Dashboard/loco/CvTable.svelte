<script lang="js">
  import Icon from '@iconify/svelte';

  import {
    addToast,
    cvId,
    event,
    hasDataToSave,
    indexOfSelectedLoco,
    locos,
    powerState,
    selectedLoco,
    ws,
  } from '../../../utils/store';

  import _ from '../../../utils/i18n';
  import message from '../../../utils/messages';
  import { range, toBin, toHex } from '../../../utils/utils';

  import Checkbox from '../../Checkbox/Checkbox.svelte';
  import CvButton from './CvButton.svelte';

  let loco = {};
  let start = 1;
  let end = 10;
  let runners = [];
  let selectedCV = 1;
  let selectedCvValue = 1;
  let factoryValues = false;
  let cvWriting = 0;
  let isWwritingCv = false;
  let isReadingOneCv = false;
  let isReadingMultipleCv = false;

  selectedLoco.subscribe((value) => {
    loco = value ? value : {}; // On first run value can be undefined

    if (!loco.cvs) {
      loco.cvs = []; // Force initialization for first run
    }
  });

  event.on('newCvValue', (cv) => {
    if (factoryValues) {
      let index = loco.cvs.findIndex((c) => c.id === cv);
      loco.cvs[index].defaultValue = loco.cvs[index].value;
      onSave();
    }

    if (cv === selectedCV) {
      isReadingOneCv = false;
    }

    if (cv === end) {
      isReadingMultipleCv = false;
    }

    if (cv === cvWriting) {
      isWwritingCv = false;
    }
  });

  event.on('cvError', (cv) => {
    if (cv === selectedCV) {
      isReadingOneCv = false;
    }

    if (cv === end) {
      isReadingMultipleCv = false;
    }

    if (cv === 2) {
      isWwritingCv = false;
    }
  });

  /** Generic functions */

  const onSave = () => {
    locos.update((value) => {
      const list = value;
      list[$indexOfSelectedLoco] = loco;
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
      isReadingOneCv = true;
      readCvs([value]);
    } else {
      addToast('warning', "L'alimentation est coupé");
    }
  };

  const onWrite = (cv, value = null) => {
    if ($powerState) {
      isWwritingCv = true;
      cvWriting = cv;

      if (value) {
        $ws.send(message.writeCv(cv, value, cvId));
      } else {
        let index = loco.cvs.findIndex((c) => c.id === cv);
        $ws.send(message.writeCv(cv, loco.cvs[index].value, cvId));
      }
    } else {
      addToast('warning', "L'alimentation est coupé");
    }
  };

  /** Change handlers */

  const onReadMulitple = () => {
    if ($powerState && start <= end) {
      isReadingMultipleCv = true;
      readCvs(range(start, end));
    } else {
      addToast('warning', "L'alimentation est coupé");
    }
  };

  const onStopReadMulitple = () => {
    isReadingMultipleCv = false;
    runners.forEach((runner) => {
      clearTimeout(runner);
    });
  };

  const onSelectedCvChange = () => {
    // If cv already exist, get his value
    if (loco.cvs.some((c) => c.id === selectedCV)) {
      let index = loco.cvs.findIndex((c) => c.id === selectedCV);
      selectedCvValue = loco.cvs[index].value;
    } else {
      selectedCvValue = 0;
    }
  };

  const mergeCvValues = (cv) => {
    if (loco.cvs.length > 0) {
      if (cv !== -1) {
        let index = loco.cvs.findIndex((c) => c.id === cv);
        loco.cvs[index].defaultValue = loco.cvs[index].value;
        onSave();
      } else {
        loco.cvs.forEach((_, index) => {
          loco.cvs[index].defaultValue = loco.cvs[index].value;
          onSave();
        });
      }
    }
  };

  // CV61 et CV10 BEMF (Compensation de charge)
</script>

<div class="flex flex-col 2xl:flex-row 2xl:justify-evenly">
  <div>
    <span class="text-lg underline underline-offset-4 mb-5">
      {$_('editSpecificCv')}
    </span>

    <div class="flex flex-row items-center gap-3 my-5">
      <label for="start">{$_('cv')}:</label>

      <input
        class="input input-ghost input-bordered input-sm max-w-xs"
        type="number"
        name="selectedCv"
        id="selectedCv"
        min="0"
        max="512"
        bind:value="{selectedCV}"
        on:change="{onSelectedCvChange}" />

      <label for="start">{$_('value')}:</label>

      <input
        class="input input-ghost input-bordered input-sm max-w-xs"
        type="number"
        name="selectedCvValue"
        id="selectedCvValue"
        min="0"
        max="255"
        bind:value="{selectedCvValue}" />

      <CvButton
        onReadClick="{() => onRead(selectedCV)}"
        onWriteClick="{() => onWrite(selectedCV, selectedCvValue)}" />

      <span
        class="btn btn-ghost loading {!isWwritingCv & !isReadingOneCv &&
          'invisible'}"></span>
    </div>
  </div>

  <div>
    <span class="text-lg underline underline-offset-4 mb-5">
      {$_('readGroupOfCv')}
    </span>

    <div class="flex flex-row items-center gap-3 my-5">
      <div class="tooltip" data-tip="{$_('readGroupOfCvNote')}">
        <Icon icon="ic:round-help-outline" class="w-5 h-5 mr-2" />
      </div>

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

      <Checkbox
        label="{$_('defaultValue')}"
        onChange="{() => (factoryValues = !factoryValues)}" />

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

      <span class="btn btn-ghost loading {!isReadingMultipleCv && 'invisible'}"
      ></span>
    </div>
  </div>
</div>

<div>
  <span class="text-lg underline underline-offset-4 mb-5">
    {$_('cvList')}
  </span>

  <table class="table w-full table-compact text-center my-5">
    <thead>
      <tr>
        <th class="w-16">{$_('cv')}</th>
        <th class="w-32 md:w-80 lg:w-auto">{$_('label')}</th>
        <th class="w-20 xl:w-32 2xl:w-auto">{$_('defaultValue')}</th>
        <th class="w-8">
          <div
            class="tooltip normal-case whitespace-normal"
            data-tip="{$_('mergeFactoryValues')}">
            <button
              class="btn btn-outline btn-xs"
              on:click|preventDefault="{() => mergeCvValues(-1)}">
              <Icon icon="ic:round-compare-arrows" class="w-5 h-5" />
            </button>
          </div>
        </th>
        <th class="w-20 xl:w-32 2xl:w-auto">
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
          <td>{cv.id}</td>
          <td class="truncate">
            {#if $_(`cv${cv.id}`) !== `cv${cv.id}`}
              {$_(`cv${cv.id}`)}
            {/if}
          </td>
          <td>
            <input
              class="input input-ghost input-bordered input-sm w-20 xl:w-32 2xl:w-auto"
              type="number"
              name="cv-{cv.id}-default-value"
              id="cv-{cv.id}-default-value"
              bind:value="{cv.defaultValue}"
              on:input="{onSave}" />
          </td>
          <td class="w-8">
            <div class="tooltip" data-tip="{$_('mergeFactoryValues')}">
              <button
                class="btn btn-xs btn-ghost btn-outline"
                on:click|preventDefault="{() => mergeCvValues(cv.id)}">
                <Icon icon="ic:round-compare-arrows" class="w-5 h-5" />
              </button>
            </div>
          </td>
          <td>
            <input
              class="input input-ghost input-bordered input-sm w-20 xl:w-32 2xl:w-auto"
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
