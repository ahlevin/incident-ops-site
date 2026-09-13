(function () {
  const stepBtn = document.getElementById("stepBtn");
  const body = document.getElementById("consoleBody");
  if (!stepBtn || !body) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stepIndex = 0;

  function renderEntry(entry) {
    const el = document.createElement("div");
    el.className = "log-entry " + entry.phase;

    const meta = document.createElement("div");
    meta.className = "log-meta";
    meta.innerHTML =
      '<span class="log-tag ' + entry.phase + '">' + entry.tag + "</span>" +
      "<span>" + entry.meta + "</span>";

    const text = document.createElement("div");
    text.className = "log-body";
    text.textContent = entry.body;

    el.appendChild(meta);
    el.appendChild(text);
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function reset() {
    body.innerHTML = "";
    stepIndex = 0;
    stepBtn.textContent = "Step through";
  }

  function stepOnce() {
    if (stepIndex >= SD_DEMO_ENTRIES.length) { reset(); return; }

    renderEntry(SD_DEMO_ENTRIES[stepIndex]);
    stepIndex++;

    stepBtn.textContent = stepIndex >= SD_DEMO_ENTRIES.length
      ? "Start over"
      : "Next (" + (stepIndex + 1) + " of " + SD_DEMO_ENTRIES.length + ")";
  }

  stepBtn.addEventListener("click", stepOnce);
})();
