(function () {
  const stepBtn = document.getElementById("ragStepBtn");
  const statusEl = document.getElementById("ragStatus");
  const flow = document.getElementById("ragFlow");
  if (!stepBtn || !flow || !statusEl) return;

  const bands = Array.prototype.slice.call(flow.querySelectorAll(".flow-band"));
  const arrows = Array.prototype.slice.call(flow.querySelectorAll(".flow-arrow"));
  const loop = flow.querySelector(".flow-loop");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let idx = 0;

  function reset() {
    bands.forEach((b) => b.classList.remove("is-live", "is-done", "is-waiting"));
    arrows.forEach((a) => a.classList.remove("is-live", "is-done"));
    if (loop) loop.classList.remove("is-live");
    idx = 0;
    statusEl.textContent = "Idle";
    stepBtn.textContent = "Step through";
  }

  function bandLabel(band) {
    const n = band.querySelector(".flow-band-name");
    return n ? n.textContent.trim() : "stage";
  }

  function gateLabel(band) {
    const tag = band.querySelector(".autonomy");
    if (!tag) return null;
    if (tag.classList.contains("gate")) return "waiting for approval";
    if (tag.classList.contains("human")) return "waiting on a person";
    return null;
  }

  function stepOnce() {
    if (idx >= bands.length) { reset(); return; }

    if (idx > 0) {
      bands[idx - 1].classList.remove("is-live", "is-waiting");
      bands[idx - 1].classList.add("is-done");
      if (arrows[idx - 1]) {
        arrows[idx - 1].classList.remove("is-live");
        arrows[idx - 1].classList.add("is-done");
      }
    }

    const band = bands[idx];
    band.classList.add("is-live");
    const gate = gateLabel(band);
    if (gate) {
      band.classList.add("is-waiting");
      statusEl.textContent = bandLabel(band) + ", " + gate;
    } else {
      statusEl.textContent = bandLabel(band);
    }
    if (arrows[idx]) arrows[idx].classList.add("is-live");

    const controls = document.querySelector(".flow-controls");
    const offset = 60 + (controls ? controls.offsetHeight : 0) + 16;
    const y = band.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });

    idx++;
    if (idx >= bands.length) {
      if (loop) loop.classList.add("is-live");
      stepBtn.textContent = "Start over";
    } else {
      stepBtn.textContent = "Next (" + (idx + 1) + " of " + bands.length + ")";
    }
  }

  stepBtn.addEventListener("click", stepOnce);
})();
