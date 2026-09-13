(function () {
  /* The SVG is in the page already, so the diagrams work without JavaScript.
     This only adds selection: click, hover and keyboard. */

  function wire(hostId, detailId, getText) {
    const host = document.getElementById(hostId);
    const detail = document.getElementById(detailId);
    if (!host || !detail) return;

    function pick(g) {
      if (!g) return;
      const sel = host.querySelectorAll("[data-id], .br-bar");
      for (let i = 0; i < sel.length; i++) sel[i].classList.remove("is-on");
      g.classList.add("is-on");
      detail.innerHTML = getText(g);
    }

    function nodeFrom(t) {
      while (t && t !== host) {
        if (t.hasAttribute && (t.hasAttribute("data-id") || t.classList.contains("br-bar"))) return t;
        t = t.parentNode;
      }
      return null;
    }

    host.addEventListener("click", function (e) { pick(nodeFrom(e.target)); });
    host.addEventListener("focusin", function (e) { pick(nodeFrom(e.target)); });
    host.addEventListener("mouseover", function (e) { pick(nodeFrom(e.target)); });
    host.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(nodeFrom(e.target)); }
    });
  }

  wire("bullseye", "bullseyeDetail", function (g) {
    const id = g.getAttribute("data-id");
    let n = null;
    for (let i = 0; i < CASE_NODES.length; i++) if (CASE_NODES[i].id === id) n = CASE_NODES[i];
    if (!n) return "";
    return '<p class="by-d-title">' + n.title + "</p>" +
      '<p class="by-d-row"><b>Who takes part</b>' + n.participants + "</p>" +
      '<p class="by-d-row"><b>What goes in</b>' + n.inputs + "</p>" +
      '<p class="by-d-row"><b>What comes out</b>' + n.outcome + "</p>";
  });

  wire("impactBars", "barsDetail", function (g) {
    return "<p>" + g.getAttribute("data-text") + "</p>";
  });
})();
