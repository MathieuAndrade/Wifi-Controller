<script lang="js">
  export let icon = '';
  export let cssClass = '';
</script>

{#if icon === 'arrow-down'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    class="{cssClass}"
  >
    <path
      d="M12 1.993C6.486 1.994 2 6.48 2 11.994c0 5.513 4.486 9.999 10 10c5.514 0 10-4.486 10-10s-4.485-10-10-10.001zm0 18.001c-4.411-.001-8-3.59-8-8c0-4.411 3.589-8 8-8.001c4.411.001 8 3.59 8 8.001s-3.589 8-8 8z"
      fill="currentColor"></path>
    <path d="M13 8h-2v4H7.991l4.005 4.005L16 12h-3z" fill="currentColor"></path>
  </svg>
{:else if icon === 'arrow-up'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    class="{cssClass}"
  >
    <path
      d="M12.001 1.993C6.486 1.994 2 6.48 2 11.994c.001 5.514 4.487 10 10 10c5.515 0 10.001-4.486 10.001-10s-4.486-10-10-10.001zM12 19.994c-4.41 0-7.999-3.589-8-8c0-4.411 3.589-8 8.001-8.001c4.411.001 8 3.59 8 8.001s-3.589 8-8.001 8z"
      fill="currentColor"></path>
    <path
      d="M12.001 8.001l-4.005 4.005h3.005V16h2v-3.994h3.004z"
      fill="currentColor"></path>
  </svg>
{:else if icon === 'arrow-left'}
  <svg
    xmlns:xlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    class="{cssClass}"
  >
    <path
      d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2S2 6.48 2 12zm18 0c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8zM8 12l4-4l1.41 1.41L11.83 11H16v2h-4.17l1.59 1.59L12 16l-4-4z"
      fill="currentColor"></path>
  </svg>
{:else}
  <svg
    xmlns:xlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    class="{cssClass}"
  >
    <path
      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10s10-4.48 10-10zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8zm12 0l-4 4l-1.41-1.41L12.17 13H8v-2h4.17l-1.59-1.59L12 8l4 4z"
      fill="currentColor"></path>
  </svg>
{/if}
