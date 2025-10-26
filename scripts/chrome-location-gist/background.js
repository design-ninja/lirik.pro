const STORAGE_KEYS = {
  token: "ghToken",
  gistId: "gistId",
  filename: "filename",
  interval: "intervalMinutes",
  lastUpdateAt: "lastUpdateAt",
  lastError: "lastError",
  lastLocation: "lastLocation"
};

const DEFAULTS = {
  filename: "location.json",
  intervalMinutes: 30
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
    filename: data[STORAGE_KEYS.filename] || DEFAULTS.filename,
    intervalMinutes: Number(data[STORAGE_KEYS.interval]) || DEFAULTS.intervalMinutes
  };
}

async function fetchLocation() {
  const res = await fetch("https://ipwho.is/");
  if (!res.ok) throw new Error("Failed to query ipwho.is");
  const json = await res.json();
  const city = json?.city || "";
  const country = json?.country || "";
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

async function updateOnce() {
  const { token, gistId, filename } = await getSettings();
  if (!token || !gistId) {
    const error = "Token or Gist ID is not set";
    await storageSet({ [STORAGE_KEYS.lastError]: error });
    return { ok: false, error };
  }

  try {
    const locationData = await fetchLocation();
    const content = JSON.stringify(locationData, null, 2);
    await patchGist(token, gistId, filename, content);
    const now = Date.now();
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

function scheduleAlarm(intervalMinutes) {
  const minutes = Math.max(5, Number(intervalMinutes) || DEFAULTS.intervalMinutes);
  chrome.alarms.create("updateLocation", { periodInMinutes: minutes });
}

chrome.runtime.onInstalled.addListener(async () => {
  const { intervalMinutes } = await getSettings();
  scheduleAlarm(intervalMinutes);
  updateOnce();
});

chrome.runtime.onStartup.addListener(async () => {
  const { intervalMinutes } = await getSettings();
  scheduleAlarm(intervalMinutes);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateLocation") {
    updateOnce();
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (changes[STORAGE_KEYS.interval]) {
    const newValue = changes[STORAGE_KEYS.interval].newValue;
    scheduleAlarm(newValue);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "updateNow") {
    updateOnce().then(sendResponse);
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
