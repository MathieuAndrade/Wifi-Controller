<script lang="js">
  import Router from 'svelte-spa-router'
  import { isLoading } from 'svelte-i18n';

  import Home from './views/Home.svelte';
  import Dashboard from './views/Dashboard.svelte';
  import Mobile from './views/Mobile.svelte';
  import Logs from './views/Logs.svelte';


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
