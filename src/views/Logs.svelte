<script lang="js">
  import _ from '../utils/i18n';

  let scrollbox;
  let dccLogs = JSON.parse(window.localStorage.getItem('dccLogs')) || [];
  window.onstorage = () => {
    dccLogs = JSON.parse(window.localStorage.getItem('dccLogs'));
    setTimeout(() => scrollbox.scrollTop = scrollbox.scrollHeight, 100);
  };

  // Scroll on mount
  setTimeout(() => scrollbox.scrollTop = scrollbox.scrollHeight, 100);
</script>

<div class="flex flex-col mx-2 space-y-2">
  <h3 class="text-md">{$_('dccMonitor')}</h3>
  <div
    bind:this="{scrollbox}"
    class="flex flex-col border rounded-lg p-2 h-96 overflow-auto">
    {#each dccLogs as text}
      <span>{text}</span>
    {/each}
  </div>
</div>
