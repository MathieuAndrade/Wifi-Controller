<script lang="js">
  import Checkbox from './Checkbox.svelte';

  export let data;
</script>

{#each data.labels as label, index}
  <Checkbox
    label="{label}"
    bind:value="{data.value[index]}"
    onChange="{data.onChange}"
  />
{/each}
