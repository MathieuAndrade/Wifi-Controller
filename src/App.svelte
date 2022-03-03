<script lang="js">
  import { Router, Route } from 'svelte-routing';
  import { isLoading } from 'svelte-i18n';
  import { NotificationDisplay } from '@beyonk/svelte-notifications';

  import Home from './views/Home.svelte';
  import Dashboard from './views/Dashboard.svelte';
  import Mobile from './views/Mobile.svelte';
  import Logs from './views/Logs.svelte';

  export let url = '';

  //TODO: Notification systeme
</script>

{#if !$isLoading}
  <div class="h-screen">
    <Router url="{url}">
      <Route path="/"><Home /></Route>
      <Route path="/dashboard"><Dashboard /></Route>
      <Route path="/mobile"><Mobile /></Route>
      <Route path="/logs"><Logs /></Route>
    </Router>
  </div>

  <NotificationDisplay />
{:else}
  <div class="h-screen">
    <span class="btn btn-ghost font-semibold text-lg normal-case loading">
    </span>
  </div>
{/if}
