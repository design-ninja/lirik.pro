const STORAGE_KEYS = {
  token: "ghToken",
  gistId: "gistId",
  filename: "filename",
  lastUpdateAt: "lastUpdateAt",
  lastError: "lastError",
  lastLocation: "lastLocation"
};

const DEFAULTS = {
  filename: "location.json"
};

function storageGet(keys) {
  return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
}

function storageSet(values) {
  return new Promise((resolve) => chrome.storage.sync.set(values, resolve));
}

async function getSettings() {
  const data = await storageGet(null);
  return {
    token: data[STORAGE_KEYS.token] || "",
    gistId: data[STORAGE_KEYS.gistId] || "",
    filename: data[STORAGE_KEYS.filename] || DEFAULTS.filename
  };
}

async function reverseGeocode(lat, lon) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to reverse geocode");
  const json = await res.json();
  const city = json?.city || json?.locality || json?.principalSubdivision || "";
  const country = json?.countryName || "";
  return { city, country };
}

async function patchGist(token, gistId, filename, content) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
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

async function updateByCoords(lat, lon) {
  const { token, gistId, filename } = await getSettings();
  if (!token || !gistId) {
    const error = "Token or Gist ID is not set";
    await storageSet({ [STORAGE_KEYS.lastError]: error });
    return { ok: false, error };
  }

  try {
    const { city, country } = await reverseGeocode(lat, lon);
    const content = JSON.stringify({ city, country }, null, 2);
    await patchGist(token, gistId, filename, content);
    const now = Date.now();
    const locationData = { city, country, method: "device" };
    await storageSet({
      [STORAGE_KEYS.lastUpdateAt]: now,
      [STORAGE_KEYS.lastError]: "",
      [STORAGE_KEYS.lastLocation]: locationData
    });
    return { ok: true, ...locationData, updatedAt: now };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await storageSet({ [STORAGE_KEYS.lastError]: msg });
    return { ok: false, error: msg };
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "updateNow" && typeof message?.lat === "number" && typeof message?.lon === "number") {
    updateByCoords(message.lat, message.lon).then(sendResponse);
    return true;
  }
  if (message?.type === "getStatus") {
    storageGet(null).then((data) => {
      sendResponse({
        lastUpdateAt: data[STORAGE_KEYS.lastUpdateAt] || null,
        lastError: data[STORAGE_KEYS.lastError] || "",
        lastLocation: data[STORAGE_KEYS.lastLocation] || null
      });
    });
    return true;
  }
});
