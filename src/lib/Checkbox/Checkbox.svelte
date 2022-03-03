<script lang="js">
  export let label = 'Checkbox';
  export let value = false;
  export let onChange;
</script>

<div class="form-control">
  <label class="cursor-pointer label justify-start">
    <input
      type="checkbox"
      class="checkbox mr-2 min-w-[24px]"
      bind:checked="{value}"
      on:change="{onChange}"
    />
    <span class="label-text">
      {label}
    </span>
  </label>
</div>
