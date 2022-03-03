<script lang="js">
  import _ from '../../utils/i18n';

  import Icons from '../Icons/Icons.svelte';

  export let cssClass = '';
  export let hideText = true;
  export let onReadClick;
  export let onWriteClick;
</script>

<div class="flex flex-row {cssClass}">
  <button
    class="btn btn-outline btn-xs btn-success mr-2"
    on:click|preventDefault="{onReadClick}"
  >
    <Icons
      cssClass="inline-block w-5 {hideText ? 'mr-0 lg:mr-2' : 'mr-2'}"
      icon="arrow-down"
    />
    <span class="{hideText ? 'hidden lg:block' : ''}">{$_('read')}</span>
  </button>
  <button
    class="btn btn-outline btn-xs btn-warning"
    on:click|preventDefault="{onWriteClick}"
  >
    <Icons
      cssClass="inline-block w-5 {hideText ? 'mr-0 lg:mr-2' : 'mr-2'}"
      icon="arrow-up"
    />
    <span class="{hideText ? 'hidden lg:block' : ''}">{$_('write')}</span>
  </button>
</div>
