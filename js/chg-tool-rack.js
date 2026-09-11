(function () {
  const btn = document.getElementById("chgToolBtn");
  const stepBtn = document.getElementById("chgToolStepBtn");
  const statusEl = document.getElementById("chgToolStatus");
  const rack = document.getElementById("chgToolRack");
  const stepsList = document.getElementById("chgToolSteps");
  if (!btn || !stepBtn || !rack || !stepsList) return;

  const steps = Array.prototype.slice.call(stepsList.querySelectorAll(".tool-step"));
  const chips = Array.prototype.slice.call(rack.querySelectorAll(".tool-chip"));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEP_MS = reduceMotion ? 0 : 1500;

  let running = false;
  let idx = 0;

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function clearAll() {
    steps.forEach((s) => s.classList.remove("is-live", "is-done"));
    chips.forEach((c) => c.classList.remove("is-hot", "was-hot"));
    idx = 0;
    statusEl.textContent = "Idle";
    stepBtn.textContent = "Step through";
    btn.textContent = "Run all";
  }

  function light(step, keepHistory) {
    // cool previously hot chips
    chips.forEach((c) => {
      if (c.classList.contains("is-hot")) {
        c.classList.remove("is-hot");
        if (keepHistory) c.classList.add("was-hot");
      }
    });

    const wanted = (step.getAttribute("data-tools") || "").split(",").map((s) => s.trim());
    chips.forEach((c) => {
      if (wanted.indexOf(c.getAttribute("data-tool")) !== -1) {
        c.classList.add("is-hot");
        c.classList.remove("was-hot");
      }
    });

    const h3 = step.querySelector("h3");
    statusEl.textContent = h3 ? h3.textContent.trim() : "";
  }

  function scrollToStep(step) {
    const ctrl = document.querySelector("#tooling .tool-controls-sticky");
    const rackWrap = document.querySelector("#tooling .rack-sticky");
    const offset =
      60 +
      (ctrl ? ctrl.offsetHeight : 0) +
      (rackWrap ? rackWrap.offsetHeight : 0) +
      16;
    const y = step.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  }

  async function runAll() {
    if (running) return;
    running = true;
    btn.disabled = true;
    stepBtn.disabled = true;
    clearAll();
    btn.textContent = "Running…";

    for (let i = 0; i < steps.length; i++) {
      if (i > 0) {
        steps[i - 1].classList.remove("is-live");
        steps[i - 1].classList.add("is-done");
      }
      steps[i].classList.add("is-live");
      light(steps[i], true);
      scrollToStep(steps[i]);
      await wait(STEP_MS);
    }

    steps[steps.length - 1].classList.remove("is-live");
    steps[steps.length - 1].classList.add("is-done");

    statusEl.textContent = "Complete";
    btn.disabled = false;
    stepBtn.disabled = false;
    btn.textContent = "Run it again";
    idx = steps.length;
    running = false;
  }

  function stepOnce() {
    if (running) return;

    if (idx >= steps.length) {
      clearAll();
      return;
    }

    if (idx > 0) {
      steps[idx - 1].classList.remove("is-live");
      steps[idx - 1].classList.add("is-done");
    }

    steps[idx].classList.add("is-live");
    light(steps[idx], true);

    scrollToStep(steps[idx]);

    idx++;
    stepBtn.textContent = idx >= steps.length
      ? "Start over"
      : "Next (" + (idx + 1) + " of " + steps.length + ")";
  }


  btn.addEventListener("click", runAll);
  stepBtn.addEventListener("click", stepOnce);
})();
