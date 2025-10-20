<script lang="js">
  import { isLoading } from 'svelte-i18n';
  import Router from 'svelte-spa-router';

  import Dashboard from './views/Dashboard.svelte';
  import Home from './views/Home.svelte';
  import Logs from './views/Logs.svelte';
  import Mobile from './views/Mobile.svelte';

  import _ from './utils/i18n';
  import { addToast, hasDataToSave } from './utils/store';

  const target = import.meta.env.VITE_TARGET;
  const isDev = import.meta.env.DEV;

  if (!isDev) {
    // Prompt to save data before closing
    window.onbeforeunload = () => {
      if ($hasDataToSave) {
        addToast('warning', $_('dataWaitingToBeSaved'));
        return target === 'soft' ? undefined : 'Do you really want to close?';
      }
      return undefined;
    };
  }

  const routes = {
    '/': Home,
    '/mobile': Mobile,
    '/logs': Logs,
    '/dashboard': Dashboard,
    '/dashboard/*': Dashboard,
  };
</script>

{#if !$isLoading}
  <Router routes="{routes}" />
{:else}
  <span class="btn btn-ghost font-semibold text-lg normal-case loading"></span>
{/if}
