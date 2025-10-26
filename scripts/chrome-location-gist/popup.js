const statusEl = document.getElementById("status");
const lastEl = document.getElementById("last");
const updateBtn = document.getElementById("update");
const optionsBtn = document.getElementById("options");

function tsToText(ts) {
  if (!ts) return "Never";
  try { return new Date(ts).toLocaleString(); } catch { return String(ts); }
}

async function load() {
  const res = await chrome.runtime.sendMessage({ type: "getStatus" });
  const loc = res?.lastLocation;
  const locText = loc ? `${loc.city || ""}${loc?.city && loc?.country ? ", " : ""}${loc.country || ""}` : "–";
  statusEl.textContent = `Last location: ${locText}${loc?.method ? ` (${loc.method})` : ""}`;
  lastEl.textContent = `Updated: ${tsToText(res?.lastUpdateAt)}`;
  if (res?.lastError) lastEl.textContent += ` • Error: ${res.lastError}`;
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

updateBtn.addEventListener("click", async () => {
  updateBtn.disabled = true;
  updateBtn.textContent = "Requesting location...";
  try {
    const pos = await getCurrentPosition();
    const { latitude, longitude } = pos.coords || {};
    updateBtn.textContent = "Updating...";
    const res = await chrome.runtime.sendMessage({ type: "updateNow", lat: latitude, lon: longitude });
    if (!res?.ok) alert(res?.error || "Unknown error");
  } catch (err) {
    const code = typeof err === "object" && err && "code" in err ? err.code : undefined;
    const msg = err?.message || String(err);
    if (code === 1) { // PERMISSION_DENIED
      const go = confirm(`${msg}.\nOpen Chrome location settings?`);
      if (go) {
        chrome.tabs.create({ url: "chrome://settings/content/location" });
      }
    } else {
      alert(msg);
    }
  }
  updateBtn.disabled = false;
  updateBtn.textContent = "Update now";
  await load();
});

optionsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

load();
