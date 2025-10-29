import { STORAGE_KEYS, storageGet, storageSet, getCurrentPosition } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form');
  const token = document.getElementById('token');
  const gistId = document.getElementById('gistId');
  const filename = document.getElementById('filename');
  const run = document.getElementById('run');
  const gapi = document.getElementById('gapi');

  const data = await storageGet(null);
  if (token) token.value = data[STORAGE_KEYS.token] || '';
  if (gistId) gistId.value = data[STORAGE_KEYS.gistId] || '';
  if (filename) filename.value = data[STORAGE_KEYS.filename] || 'location.json';
  if (gapi) gapi.value = data[STORAGE_KEYS.googleKey] || '';

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await storageSet({
      [STORAGE_KEYS.token]: token?.value?.trim() || '',
      [STORAGE_KEYS.gistId]: gistId?.value?.trim() || '',
      [STORAGE_KEYS.filename]: filename?.value?.trim() || 'location.json',
      [STORAGE_KEYS.googleKey]: gapi?.value?.trim() || ''
    });
    alert('Saved');
  });

  run?.addEventListener('click', async () => {
    run.disabled = true;
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords || {};
      // Always use English for location names
      const res = await chrome.runtime.sendMessage({ type: 'updateNow', lat: latitude, lon: longitude, language: 'en' });
      if (res?.ok) {
        alert(`Updated to ${res.city || ''}${res.city && res.country ? ', ' : ''}${res.country || ''}`);
      } else {
        alert(`Failed: ${res?.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(err?.message || String(err));
    }
    run.disabled = false;
  });
});
