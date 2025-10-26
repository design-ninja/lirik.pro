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
  statusEl.textContent = `Last location: ${locText}`;
  lastEl.textContent = `Updated: ${tsToText(res?.lastUpdateAt)}`;
  if (res?.lastError) lastEl.textContent += ` • Error: ${res.lastError}`;
}

updateBtn.addEventListener("click", async () => {
  updateBtn.disabled = true;
  updateBtn.textContent = "Updating...";
  const res = await chrome.runtime.sendMessage({ type: "updateNow" });
  updateBtn.disabled = false;
  updateBtn.textContent = "Update now";
  await load();
  if (!res?.ok) alert(res?.error || "Unknown error");
});

optionsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

load();
