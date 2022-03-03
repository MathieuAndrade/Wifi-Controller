<script lang="js">
  export let icon = '';
  export let cssClass = '';
</script>

{#if icon === 'gif'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 32 32"
    class="{cssClass}"
  >
    <path
      d="M2 12v8a3 3 0 0 0 3 3h5v-8H6v2h2v4H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h5V9H5a3 3 0 0 0-3 3z"
      fill="currentColor"></path>
    <path d="M30 11V9h-8v14h2v-6h5v-2h-5v-4h6z" fill="currentColor"></path>
    <path d="M12 9v2h3v10h-3v2h8v-2h-3V11h3V9h-8z" fill="currentColor"></path>
  </svg>
{:else if icon === 'jpg' || icon === 'jpeg'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 32 32"
    class="{cssClass}"
  >
    <path
      d="M30 23h-6a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h6v2h-6v10h4v-4h-2v-2h4z"
      fill="currentColor"></path>
    <path
      d="M14 23h-2V9h6a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4zm0-7h4v-5h-4z"
      fill="currentColor"></path>
    <path
      d="M8 23H4a2 2 0 0 1-2-2v-2h2v2h4V9h2v12a2 2 0 0 1-2 2z"
      fill="currentColor"></path>
  </svg>
{:else if icon === 'svg'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    class="{cssClass}"
  >
    <g fill="none">
      <path
        d="M18 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7a.104.104 0 0 1 .027 0h.006a.15.15 0 0 0 .029.006c.088.006.175.023.259.051H13.363a.421.421 0 0 1 .052.043a.988.988 0 0 1 .293.2l6 6a.987.987 0 0 1 .2.293a.735.735 0 0 1 .023.066l.01.028c.028.083.044.17.049.258a.1.1 0 0 0 .007.029v.006A.112.112 0 0 1 20 9v11a2 2 0 0 1-2 2zm-2.5-8c-.454-.024-.89.18-1.161.545a2.6 2.6 0 0 0-.4 1.547v.876a2.426 2.426 0 0 0 .432 1.514c.29.35.728.541 1.181.518c.28.003.557-.05.816-.154l.013-.005l-.016.007c.245-.101.46-.26.63-.464v-2.011h-1.509v.742h.623v.893l-.078.06a.723.723 0 0 1-.427.117a.641.641 0 0 1-.592-.3a2.01 2.01 0 0 1-.178-.969v-.883a2.018 2.018 0 0 1 .166-.926a.557.557 0 0 1 .523-.292a.531.531 0 0 1 .435.171c.117.19.177.41.175.632H17a1.96 1.96 0 0 0-.423-1.227A1.4 1.4 0 0 0 15.5 14zM7 17.4c-.006.296.063.59.2.852c.126.234.317.426.55.555c.237.129.503.195.773.193c.366.02.724-.11.994-.357a1.33 1.33 0 0 0 .366-.993c.013-.34-.09-.676-.293-.95a2.186 2.186 0 0 0-.934-.632a1.652 1.652 0 0 1-.513-.334a.536.536 0 0 1-.143-.367a.608.608 0 0 1 .13-.408a.45.45 0 0 1 .363-.154c.148-.008.29.06.377.181A.853.853 0 0 1 9 15.5h.886a1.739 1.739 0 0 0-.172-.782a1.245 1.245 0 0 0-.487-.531A1.382 1.382 0 0 0 8.505 14a1.409 1.409 0 0 0-1 .374a1.3 1.3 0 0 0-.393.986a1.4 1.4 0 0 0 .291.882c.258.293.585.516.951.649c.186.072.356.18.5.317c.101.127.15.287.139.448c0 .361-.157.544-.465.544a.58.58 0 0 1-.484-.19a1.012 1.012 0 0 1-.148-.612L7 17.4zm3.182-3.332l1.26 4.866h.925l1.269-4.866h-.991L11.9 17.6l-.737-3.529l-.981-.003zM13 4v5h5l-5-5z"
        fill="currentColor"></path>
    </g>
  </svg>
{:else if icon === 'png'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 32 32"
    class="{cssClass}"
  >
    <path
      d="M30 23h-6a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h6v2h-6v10h4v-4h-2v-2h4z"
      fill="currentColor"></path>
    <path d="M18 19L14.32 9H12v14h2V13l3.68 10H20V9h-2v10z" fill="currentColor"
    ></path>
    <path
      d="M4 23H2V9h6a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H4zm0-7h4v-5H4z"
      fill="currentColor"></path>
  </svg>
{:else if icon === 'json'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    class="{cssClass}"
  >
    <path
      d="M5 3h2v2H5v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2m-7 12a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1z"
      fill="currentColor"></path>
  </svg>
{:else if icon === 'gz' || icon === 'html' || icon === 'html.gz'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 32 32"
    class="{cssClass}"
  >
    <path d="M28 19v-8h-2v10h6v-2h-4z" fill="currentColor"></path>
    <path
      d="M24 11h-2l-1.5 4l-1.5-4h-2v10h2v-7l1.5 4l1.5-4v7h2V11z"
      fill="currentColor"></path>
    <path d="M9 13h2v8h2v-8h2v-2H9v2z" fill="currentColor"></path>
    <path d="M5 11v4H2v-4H0v10h2v-4h3v4h2V11H5z" fill="currentColor"></path>
  </svg>
{:else}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 1024 1024"
    class="{cssClass}"
  >
    <path
      d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"
      fill="currentColor"></path>
  </svg>
{/if}
