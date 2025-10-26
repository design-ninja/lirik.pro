const STORAGE_KEYS = {
  token: "ghToken",
  gistId: "gistId",
  filename: "filename",
  googleKey: "googleApiKey",
  language: "language"
};

function storageGet(keys) {
  return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
}

function storageSet(values) {
  return new Promise((resolve) => chrome.storage.sync.set(values, resolve));
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation API not available"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form");
  const token = document.getElementById("token");
  const gistId = document.getElementById("gistId");
  const filename = document.getElementById("filename");
  const run = document.getElementById("run");
  const gapi = document.getElementById("gapi");
  const lang = document.getElementById("lang");

  const data = await storageGet(null);
  if (token) token.value = data[STORAGE_KEYS.token] || "";
  if (gistId) gistId.value = data[STORAGE_KEYS.gistId] || "";
  if (filename) filename.value = data[STORAGE_KEYS.filename] || "location.json";
  if (gapi) gapi.value = data[STORAGE_KEYS.googleKey] || "";
  if (lang) lang.value = data[STORAGE_KEYS.language] || "en";

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await storageSet({
      [STORAGE_KEYS.token]: token?.value?.trim() || "",
      [STORAGE_KEYS.gistId]: gistId?.value?.trim() || "",
      [STORAGE_KEYS.filename]: filename?.value?.trim() || "location.json",
      [STORAGE_KEYS.googleKey]: gapi?.value?.trim() || "",
      [STORAGE_KEYS.language]: lang?.value?.trim() || "en"
    });
    alert("Saved");
  });

  run?.addEventListener("click", async () => {
    run.disabled = true;
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords || {};
      const res = await chrome.runtime.sendMessage({ type: "updateNow", lat: latitude, lon: longitude, language: (lang?.value?.trim() || "en") });
      if (res?.ok) {
        alert(`Updated to ${res.city || ""}${res.city && res.country ? ", " : ""}${res.country || ""}`);
      } else {
        alert(`Failed: ${res?.error || "Unknown error"}`);
      }
    } catch (err) {
      alert(err?.message || String(err));
    }
    run.disabled = false;
  });
});
