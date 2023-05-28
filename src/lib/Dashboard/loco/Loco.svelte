<script lang="js">
  import Router, { link, location} from 'svelte-spa-router';

  import { selectedLoco } from '../../../utils/store';
  import _ from '../../../utils/i18n';
  import { isValidImage } from '../../../utils/utils';

  import Image from '../../../lib/Image.svelte';
  import Throttle from './Throttle.svelte';
  import Informations from './Informations.svelte';
  import CvTable from './CvTable.svelte';
  import CvComplexe from './CvComplexe.svelte';

  const routes = {
    '/dashboard/locomotive': Throttle,
    '/dashboard/locomotive/throttle': Throttle,
    '/dashboard/locomotive/informations': Informations,
    '/dashboard/locomotive/cv/table': CvTable,
    '/dashboard/locomotive/cv/complexe': CvComplexe,
  }
</script>

<div>
  <div class="prose mb-2">
    <h2>{$selectedLoco.shortName}</h2>
  </div>

  <div class="flex flex-row space-x-5">
    <Image
      imgUrl="{isValidImage($selectedLoco.imageUrl) ? $selectedLoco.imageUrl : '/images/train.png'}"
      cssClass="border p-2 border-base-300 rounded-3xl shadow-lg max-h-44"
      width="{400}"/>

    <div class="flex flex-col">
      <span class="font-bold">{$_('address')} :</span>
      <span class="font-bold">{$_('shortName')} :</span>
      <span class="font-bold">{$_('longName')} :</span>
    </div>

    <div class="flex flex-col">
      <span>{$selectedLoco.address ? $selectedLoco.address : ''}</span>
      <span>{$selectedLoco.shortName ? $selectedLoco.shortName : ''}</span>
      <span>{$selectedLoco.longName ? $selectedLoco.longName : ''}</span>
    </div>

    <div class="flex flex-col">
      <span class="font-bold">{$_('locoMark')} :</span>
      <span class="font-bold">{$_('locoDecoder')} :</span>
      <span class="font-bold">{$_('length')} :</span>
    </div>

    <div class="flex flex-col">
      <span>{$selectedLoco.mark ? $selectedLoco.mark : ''}</span>
      <span>{$selectedLoco.decoder ? $selectedLoco.decoder : ''}</span>
      <span>{$selectedLoco.length ? $selectedLoco.length : ''}</span>
    </div>
  </div>

  <div class="tabs flex-nowrap whitespace-nowrap pt-4 pb-4">
    <a
      use:link
      href="/dashboard/locomotive/throttle"
      class="tab tab-lifted xl:tab-lg {$location === '/dashboard/locomotive/throttle' ? 'tab-active' : ''} {$location === '/dashboard/locomotive' ? 'tab-active' : ''}">
      {$_('steering')}
    </a>
    <a
      use:link
      href="/dashboard/locomotive/informations"
      class="tab tab-lifted xl:tab-lg {$location === '/dashboard/locomotive/informations' ? 'tab-active' : ''}">
      {$_('informations')}
    </a>
    <a
      use:link
      href="/dashboard/locomotive/cv/table"
      class="tab tab-lifted xl:tab-lg {$location === '/dashboard/locomotive/cv/table' ? 'tab-active' : ''}">
      {$_('cvTable')}
    </a>
    <a
      use:link
      href="/dashboard/locomotive/cv/complexe"
      class="tab tab-lifted xl:tab-lg {$location === '/dashboard/locomotive/cv/complexe' ? 'tab-active' : ''}">
      {$_('cvComplexe')}
    </a>
    <span class="tab tab-lifted xl:tab-lg flex-grow cursor-default"></span>
  </div>

  <Router {routes} />
</div>
