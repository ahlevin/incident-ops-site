(function () {
  const btn = document.getElementById("flowBtn");
  const stepBtn = document.getElementById("flowStepBtn");
  const statusEl = document.getElementById("flowStatus");
  const flow = document.getElementById("flow");
  if (!btn || !stepBtn || !flow || !statusEl) return;

  const bands = Array.prototype.slice.call(flow.querySelectorAll(".flow-band"));
  const arrows = Array.prototype.slice.call(flow.querySelectorAll(".flow-arrow"));
  const loop = flow.querySelector(".flow-loop");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BAND_MS = reduceMotion ? 0 : 900;
  const ARROW_MS = reduceMotion ? 0 : 700;
  const GATE_MS = reduceMotion ? 0 : 1300;

  let running = false;   // true during "Run all"
  let stepIndex = 0;      // how many bands revealed in step mode

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function reset() {
    bands.forEach((b) => b.classList.remove("is-live", "is-done", "is-waiting"));
    arrows.forEach((a) => a.classList.remove("is-live", "is-done"));
    if (loop) loop.classList.remove("is-live");
    stepIndex = 0;
    statusEl.textContent = "Idle";
    stepBtn.textContent = "Step through";
    btn.textContent = "Run all";
  }

  function bandLabel(band) {
    const name = band.querySelector(".flow-band-name");
    return name ? name.textContent.trim() : "stage";
  }

  function gateLabel(band) {
    const tag = band.querySelector(".autonomy");
    if (!tag) return null;
    if (tag.classList.contains("gate")) return "waiting for approval";
    if (tag.classList.contains("human")) return "waiting on a person";
    return null;
  }

  async function runAll() {
    if (running) return;
    running = true;
    btn.disabled = true;
    stepBtn.disabled = true;
    btn.textContent = "Running…";
    reset();
    btn.textContent = "Running…";

    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];
      band.classList.add("is-live");
      statusEl.textContent = bandLabel(band);
      await wait(BAND_MS);

      const gate = gateLabel(band);
      if (gate) {
        band.classList.add("is-waiting");
        statusEl.textContent = bandLabel(band) + ": " + gate;
        await wait(GATE_MS);
        band.classList.remove("is-waiting");
      }

      band.classList.remove("is-live");
      band.classList.add("is-done");

      if (arrows[i]) {
        arrows[i].classList.add("is-live");
        statusEl.textContent = "passing payload…";
        await wait(ARROW_MS);
        arrows[i].classList.remove("is-live");
        arrows[i].classList.add("is-done");
      }
    }

    if (loop) {
      loop.classList.add("is-live");
      statusEl.textContent = "known error filed: fed back to triage";
      await wait(BAND_MS);
    }

    statusEl.textContent = "Complete";
    btn.disabled = false;
    stepBtn.disabled = false;
    btn.textContent = "Run it again";
    stepBtn.textContent = "Step through";
    stepIndex = bands.length;
    running = false;
  }

  function stepOnce() {
    if (running) return;

    // Finished (either by stepping or a full run) -> start over
    if (stepIndex >= bands.length) {
      reset();
      return;
    }

    // Dim the previously highlighted band
    if (stepIndex > 0) {
      bands[stepIndex - 1].classList.remove("is-live", "is-waiting");
      bands[stepIndex - 1].classList.add("is-done");
      if (arrows[stepIndex - 1]) {
        arrows[stepIndex - 1].classList.remove("is-live");
        arrows[stepIndex - 1].classList.add("is-done");
      }
    }

    const band = bands[stepIndex];
    band.classList.add("is-live");

    const gate = gateLabel(band);
    if (gate) {
      band.classList.add("is-waiting");
      statusEl.textContent = bandLabel(band) + ": " + gate;
    } else {
      statusEl.textContent = bandLabel(band);
    }

    if (arrows[stepIndex]) arrows[stepIndex].classList.add("is-live");

    // Scroll so the band sits just below the sticky topbar + controls,
    // never behind them.
    const controls = document.querySelector(".flow-controls");
    const offset = 60 + (controls ? controls.offsetHeight : 0) + 16;
    const y = band.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });

    stepIndex++;

    if (stepIndex >= bands.length) {
      if (loop) loop.classList.add("is-live");
      stepBtn.textContent = "Start over";
    } else {
      stepBtn.textContent = "Next (" + (stepIndex + 1) + " of " + bands.length + ")";
    }
  }

  btn.addEventListener("click", runAll);
  stepBtn.addEventListener("click", stepOnce);
})();
