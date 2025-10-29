import { STORAGE_KEYS, DEFAULTS, storageGet, storageSet } from './utils.js';

async function getSettings() {
  const data = await storageGet(null);
  return {
    token: data[STORAGE_KEYS.token] || '',
    gistId: data[STORAGE_KEYS.gistId] || '',
    filename: data[STORAGE_KEYS.filename] || DEFAULTS.filename,
    googleKey: data[STORAGE_KEYS.googleKey] || '',
    // Always use English for location names
    language: 'en'
  };
}

async function reverseGeocodeGoogle(lat, lon, apiKey, language) {
  if (!apiKey) throw new Error('No Google API key');

  const params = new URLSearchParams({
    latlng: `${lat},${lon}`,
    // We request a broad set of types and then prioritize them in our code.
    // This gives us more control over selecting the correct city name.
    result_type: 'locality|postal_town|administrative_area_level_1',
    key: apiKey
  });
  if (language) params.set('language', language);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to reverse geocode (Google)');

  const json = await res.json();

  if (json.status !== 'OK' || !Array.isArray(json.results) || json.results.length === 0) {
    throw new Error(`Could not find a city for the given coordinates. Status: ${json.status || 'UNKNOWN'}`);
  }

  let city = null;
  let country = null;

  // The priority of types to check for the city name.
  // For locations like Phuket, 'administrative_area_level_1' represents the province,
  // which is what we want instead of the sub-district ('locality').
  const cityTypePriority = ['administrative_area_level_1', 'locality', 'postal_town'];

  // Find country first - it's usually consistent across results.
  for (const result of json.results) {
    const countryComp = result.address_components.find((c) => c.types.includes('country'));
    if (countryComp) {
      country = countryComp.long_name || countryComp.short_name;
      break;
    }
  }

  // Now, find the city by iterating through component types in order of priority.
  // We search all results for the highest-priority type before moving to the next.
  for (const type of cityTypePriority) {
    for (const result of json.results) {
      const component = result.address_components.find((c) => c.types.includes(type));
      if (component) {
        city = component.long_name || component.short_name;
        // We found a component of the current priority type, so we can stop searching
        // for this type and break out to the outer loop check.
        break;
      }
    }
    // If we've found a city, we can stop checking lower-priority types.
    if (city) {
      break;
    }
  }

  // A final fallback if no suitable component was found.
  if (!city && json.results[0]?.formatted_address) {
    // Take the first part of the formatted address.
    city = json.results[0].formatted_address.split(',')[0];
  }

  return {
    city: city || '',
    country: country || ''
  };
}

async function updateByCoords(lat, lon, languageOverride) {
  const { token, gistId, filename, googleKey, language } = await getSettings();
  if (!token || !gistId) {
    const error = 'Token or Gist ID is not set';
    await storageSet({ [STORAGE_KEYS.lastError]: error });
    return { ok: false, error };
  }

  const lang = languageOverride || language || 'en';

  try {
    const { city, country } = await reverseGeocodeGoogle(lat, lon, googleKey, lang);
    const content = JSON.stringify({ city, country }, null, 2);
    await patchGist(token, gistId, filename, content);
    const now = Date.now();
    const locationData = { city, country, method: 'device' };
    await storageSet({
      [STORAGE_KEYS.lastUpdateAt]: now,
      [STORAGE_KEYS.lastError]: '',
      [STORAGE_KEYS.lastLocation]: locationData
    });
    return { ok: true, ...locationData, updatedAt: now };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await storageSet({ [STORAGE_KEYS.lastError]: msg });
    return { ok: false, error: msg };
  }
}

async function patchGist(token, gistId, filename, content) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      files: {
        [filename]: { content }
      }
    })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${txt}`);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'updateNow' && typeof message?.lat === 'number' && typeof message?.lon === 'number') {
    updateByCoords(message.lat, message.lon, message.language).then(sendResponse);
    return true;
  }
  if (message?.type === 'getStatus') {
    storageGet(null).then((data) => {
      sendResponse({
        lastUpdateAt: data[STORAGE_KEYS.lastUpdateAt] || null,
        lastError: data[STORAGE_KEYS.lastError] || '',
        lastLocation: data[STORAGE_KEYS.lastLocation] || null
      });
    });
    return true;
  }
});
