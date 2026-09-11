(function () {
  const btn = document.getElementById("ixBtn");
  const stepBtn = document.getElementById("ixStepBtn");
  const statusEl = document.getElementById("ixStatus");
  const flow = document.getElementById("ixFlow");
  if (!btn || !stepBtn || !flow || !statusEl) return;

  const links = Array.prototype.slice.call(flow.querySelectorAll(".ix-link"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEP_MS = reduceMotion ? 0 : 1600;

  let running = false;
  let idx = 0;

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function clearAll() {
    links.forEach((l) => l.classList.remove("is-live", "is-done"));
    idx = 0;
    statusEl.textContent = "Idle";
    stepBtn.textContent = "Step through";
    btn.textContent = "Run all";
  }

  function labelFor(link) {
    const n = link.querySelector(".ix-name");
    return n ? n.textContent.trim() : "";
  }

  function scrollTo(link) {
    const ctrl = document.getElementById("ixControls");
    const offset = 60 + (ctrl ? ctrl.offsetHeight : 0) + 20;
    const y = link.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  }

  async function runAll() {
    if (running) return;
    running = true;
    btn.disabled = true;
    stepBtn.disabled = true;
    clearAll();
    btn.textContent = "Running…";

    for (let i = 0; i < links.length; i++) {
      if (i > 0) {
        links[i - 1].classList.remove("is-live");
        links[i - 1].classList.add("is-done");
      }
      links[i].classList.add("is-live");
      statusEl.textContent = labelFor(links[i]);
      scrollTo(links[i]);
      await wait(STEP_MS);
    }

    links[links.length - 1].classList.remove("is-live");
    links[links.length - 1].classList.add("is-done");
    statusEl.textContent = "Complete";
    btn.disabled = false;
    stepBtn.disabled = false;
    btn.textContent = "Run it again";
    idx = links.length;
    running = false;
  }

  function stepOnce() {
    if (running) return;
    if (idx >= links.length) { clearAll(); return; }

    if (idx > 0) {
      links[idx - 1].classList.remove("is-live");
      links[idx - 1].classList.add("is-done");
    }
    links[idx].classList.add("is-live");
    statusEl.textContent = labelFor(links[idx]);
    scrollTo(links[idx]);

    idx++;
    stepBtn.textContent = idx >= links.length
      ? "Start over"
      : "Next (" + (idx + 1) + " of " + links.length + ")";
  }

  btn.addEventListener("click", runAll);
  stepBtn.addEventListener("click", stepOnce);
})();
