const STORAGE_KEYS = {
  token: "ghToken",
  gistId: "gistId",
  filename: "filename",
  interval: "intervalMinutes"
};

function storageGet(keys) {
  return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
}

function storageSet(values) {
  return new Promise((resolve) => chrome.storage.sync.set(values, resolve));
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form");
  const token = document.getElementById("token");
  const gistId = document.getElementById("gistId");
  const filename = document.getElementById("filename");
  const interval = document.getElementById("interval");
  const run = document.getElementById("run");

  const data = await storageGet(null);
  token.value = data[STORAGE_KEYS.token] || "";
  gistId.value = data[STORAGE_KEYS.gistId] || "";
  filename.value = data[STORAGE_KEYS.filename] || "location.json";
  interval.value = String(data[STORAGE_KEYS.interval] || 30);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await storageSet({
      [STORAGE_KEYS.token]: token.value.trim(),
      [STORAGE_KEYS.gistId]: gistId.value.trim(),
      [STORAGE_KEYS.filename]: filename.value.trim() || "location.json",
      [STORAGE_KEYS.interval]: Math.max(5, Number(interval.value) || 30)
    });
    alert("Saved");
  });

  run.addEventListener("click", async () => {
    run.disabled = true;
    const res = await chrome.runtime.sendMessage({ type: "updateNow" });
    run.disabled = false;
    if (res?.ok) {
      alert(`Updated to ${res.city || ""}${res.city && res.country ? ", " : ""}${res.country || ""}`);
    } else {
      alert(`Failed: ${res?.error || "Unknown error"}`);
    }
  });
});
