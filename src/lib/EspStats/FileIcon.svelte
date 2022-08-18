<script lang="js">
  import Icon from '@iconify/svelte';

  export let type = '';
</script>

{#if type === 'gif'}
  <Icon icon="carbon:gif" class="inline-block w-5 h-5 mr-2 text-accent" />
{:else if type === 'jpg' || type === 'jpeg'}
  <Icon icon="carbon:jpg" class="inline-block w-5 h-5 mr-2 text-accent" />
{:else if type === 'svg'}
  <Icon icon="carbon:svg" class="inline-block w-5 h-5 mr-2 text-accent" />
{:else if type === 'png'}
  <Icon icon="carbon:png" class="inline-block w-5 h-5 mr-2 text-accent" />
{:else if type === 'json'}
  <Icon icon="carbon:json" class="inline-block w-5 h-5 mr-2 text-accent" />
{:else if type === 'gz' || type === 'html' || type === 'html.gz'}
  <Icon icon="carbon:html" class="inline-block w-5 h-5 mr-2 text-accent" />
{:else}
  <Icon
    icon="ic:outline-insert-drive-file"
    class="inline-block w-5 h-5 mr-2 text-accent" />
{/if}
