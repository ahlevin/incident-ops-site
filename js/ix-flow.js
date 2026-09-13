(function () {
  const stepBtn = document.getElementById("ixStepBtn");
  const statusEl = document.getElementById("ixStatus");
  const flow = document.getElementById("ixFlow");
  if (!stepBtn || !flow || !statusEl) return;

  const links = Array.prototype.slice.call(flow.querySelectorAll(".ix-link"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let idx = 0;

  function clearAll() {
    links.forEach((l) => l.classList.remove("is-live", "is-done"));
    idx = 0;
    statusEl.textContent = "Idle";
    stepBtn.textContent = "Step through";
  }

  function stepOnce() {
    if (idx >= links.length) { clearAll(); return; }

    if (idx > 0) {
      links[idx - 1].classList.remove("is-live");
      links[idx - 1].classList.add("is-done");
    }
    links[idx].classList.add("is-live");
    const n = links[idx].querySelector(".ix-name");
    statusEl.textContent = n ? n.textContent.trim() : "";

    const ctrl = document.getElementById("ixControls");
    const offset = 60 + (ctrl ? ctrl.offsetHeight : 0) + 20;
    const y = links[idx].getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });

    idx++;
    stepBtn.textContent = idx >= links.length
      ? "Start over"
      : "Next (" + (idx + 1) + " of " + links.length + ")";
  }

  stepBtn.addEventListener("click", stepOnce);
})();
