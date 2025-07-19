import { _, getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('../assets/i18n/en.json'));
register('es', () => import('../assets/i18n/es.json'));
register('fr', () => import('../assets/i18n/fr.json'));

init({
  fallbackLocale: 'en',
  initialLocale:
    localStorage.getItem('locale') || getLocaleFromNavigator() || 'en',
});

export default _;
