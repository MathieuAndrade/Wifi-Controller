<script lang="js">
  import Icon from '@iconify/svelte';
  import { link, push } from 'svelte-spa-router';

  import _ from '../utils/i18n';

  const version = __APP_VERSION__;

  push('/dashboard/locomotive'); // Redirect to dashboard on first load
</script>

<div class="min-h-screen bg-base-200 text-center hero p-5">
  <div class="text-center">
    <h1 class="mb-5 text-4xl font-bold">
      {$_('homeTitle')} (V {version})
    </h1>
    <div>
      <p class="mb-10">
        {$_('homeDescription')}
      </p>

      <p class="mb-5 font-bold">
        {$_('chooseYourApp')}
      </p>

      <div
        class="flex flex-row flex-wrap justify-center mt-5 space-y-2 xl:space-y-0 xl:space-x-2">
        <div class="card shadow-lg border border-base-300">
          <div class="card-body">
            <h2 class="card-title">{$_('dashboardTitle')}</h2>
            <p class="max-w-md">
              {$_('dashboardDescription')}
            </p>
            <p class="mt-5 font-semibold">{$_('dashboardNote')}</p>
            <div class="justify-end card-actions">
              <a class="btn btn-outline" href="/dashboard/locomotive" use:link>
                {$_('dashboardTitle')}
                <Icon icon="ep:arrow-right-bold" class="w-6 h-6 ml-2" />
              </a>
            </div>
          </div>
        </div>

        <!--
        <div class="card shadow-lg border border-base-300">
          <div class="card-body">
            <h2 class="card-title">{$_('mobileTitle')}</h2>
            <p class="max-w-md">
              {$_('mobileDescription')}
            </p>
            <p class="mt-5 font-semibold invisible">fake</p>
            <div class="justify-end card-actions">
              <a class="btn btn-outline" href="/mobile" use:link>
                {$_('mobileTitle')}
                <Icon icon="ep:arrow-right-bold" class="w-6 h-6 ml-2"/>
              </a>
            </div>
          </div>
        </div>
      -->
      </div>

      <p class="mt-5">
        {$_('homeNote')}
      </p>
    </div>
  </div>
</div>
