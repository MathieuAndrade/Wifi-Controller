<script lang="js">
  import Icon from '@iconify/svelte';
  import { toasts } from '../utils/store';

  setInterval(() => {
    if ($toasts) {
      const time = Date.now();
      toasts.update((value) =>
        value.filter((item) => {
          return time < item.time + 10000;
        }),
      );
    }
  }, 10000);
</script>

<div class="toast toast-bottom toast-end">
  {#if $toasts}
    {#each $toasts || [] as item}
      {#if item.type === 'success'}
        <div class="alert alert-success shadow-lg">
          <div>
            <Icon
              icon="ic:outline-check-circle-outline"
              class="flex-shrink-0 h-6 w-6" />
            <span>{item.message}</span>
          </div>
        </div>
      {:else if item.type === 'warning'}
        <div class="alert alert-warning shadow-lg">
          <div>
            <Icon icon="ic:round-warning-amber" class="flex-shrink-0 h-6 w-6" />
            <span>{item.message}</span>
          </div>
        </div>
      {:else if item.type === 'error'}
        <div class="alert alert-error shadow-lg">
          <div>
            <Icon icon="mi:circle-error" class="flex-shrink-0 h-6 w-6" />
            <span>{item.message}</span>
          </div>
        </div>
      {:else}
        <div class="alert alert-info shadow-lg">
          <div>
            <Icon icon="ic:outline-info" class="flex-shrink-0 h-6 w-6" />
            <span>{item.message}</span>
          </div>
        </div>
      {/if}
    {/each}
  {/if}
</div>
