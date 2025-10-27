export const STORAGE_KEYS = {
  token: 'ghToken',
  gistId: 'gistId',
  filename: 'filename',
  lastUpdateAt: 'lastUpdateAt',
  lastError: 'lastError',
  lastLocation: 'lastLocation',
  googleKey: 'googleApiKey',
  language: 'language'
};

export const DEFAULTS = {
  filename: 'location.json',
  language: 'en'
};

export function storageGet(keys) {
  return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
}

export function storageSet(values) {
  return new Promise((resolve) => chrome.storage.sync.set(values, resolve));
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation API not available'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  });
}
