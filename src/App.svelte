<script lang="js">
  import Router from 'svelte-spa-router'
  import { isLoading } from 'svelte-i18n';

  import Home from './views/Home.svelte';
  import Dashboard from './views/Dashboard.svelte';
  import Mobile from './views/Mobile.svelte';
  import Logs from './views/Logs.svelte';

  import { hasDataToSave, addToast } from './utils/store';
  import _ from './utils/i18n';

  const target = import.meta.env.VITE_TARGET;

  // Prompt to save data before closing
  window.onbeforeunload = () => {
    console.log(target);
    if ($hasDataToSave) {
      addToast('warning', $_('dataWaitingToBeSaved'));
      return target === 'soft' ? undefined : 'Do you really want to close?';
    }
    return undefined;
  };

  const routes = {
    '/': Home,
    '/mobile': Mobile,
    '/logs': Logs,
    '/dashboard': Dashboard,
    '/dashboard/*': Dashboard,
  }
</script>

{#if !$isLoading}
  <Router {routes}/>

{:else}
  <span class="btn btn-ghost font-semibold text-lg normal-case loading" />
{/if}
