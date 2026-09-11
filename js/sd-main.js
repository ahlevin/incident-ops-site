(function () {
  const runBtn = document.getElementById("runBtn");
  const stepBtn = document.getElementById("stepBtn");
  const body = document.getElementById("consoleBody");

  if (!runBtn || !stepBtn || !body) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEP_DELAY = reduceMotion ? 0 : 850;

  let busy = false;      // true while "Run all" is animating
  let stepIndex = 0;      // how many entries have been revealed in step mode

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

  function resetConsole() {
    body.innerHTML = "";
    stepIndex = 0;
    stepBtn.textContent = "Step through";
  }

  async function runAll() {
    if (busy) return;
    busy = true;
    runBtn.disabled = true;
    stepBtn.disabled = true;
    runBtn.textContent = "Running…";
    resetConsole();

    for (let i = 0; i < SD_DEMO_ENTRIES.length; i++) {
      renderEntry(SD_DEMO_ENTRIES[i]);
      if (i < SD_DEMO_ENTRIES.length - 1) {
        await new Promise((r) => setTimeout(r, STEP_DELAY));
      }
    }

    runBtn.disabled = false;
    stepBtn.disabled = false;
    runBtn.textContent = "Run it again";
    stepBtn.textContent = "Step through";
    stepIndex = SD_DEMO_ENTRIES.length;
    busy = false;
  }

  function stepOnce() {
    if (busy) return;

    // If we just finished a full run, or reached the end of stepping, start over.
    if (stepIndex >= SD_DEMO_ENTRIES.length) {
      resetConsole();
      runBtn.textContent = "Run all";
      return;
    }

    renderEntry(SD_DEMO_ENTRIES[stepIndex]);
    stepIndex++;

    if (stepIndex >= SD_DEMO_ENTRIES.length) {
      stepBtn.textContent = "Start over";
    } else {
      stepBtn.textContent = "Next step (" + (stepIndex + 1) + " of " + SD_DEMO_ENTRIES.length + ")";
    }
  }

  runBtn.addEventListener("click", runAll);
  stepBtn.addEventListener("click", stepOnce);
})();
