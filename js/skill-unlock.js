(function () {
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  async function deriveKey(password, salt) {
    const material = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: SKILL_ITERATIONS, hash: "SHA-256" },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  }

  async function decryptSkill(slug, password) {
    const rec = SKILLS_LOCKED[slug];
    if (!rec) throw new Error("no such skill");
    const key = await deriveKey(password, b64(rec.s));
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64(rec.i) }, key, b64(rec.c)
    );
    return new TextDecoder().decode(plain);
  }

  // Session-only: held in memory, never written to storage.
  let unlockedPassword = null;

  async function unlockAll(password) {
    const slugs = Object.keys(SKILLS_LOCKED);
    // Verify against the first available skill before applying to all.
    await decryptSkill(slugs[0], password);
    unlockedPassword = password;

    const blocks = document.querySelectorAll(".skill-locked[data-skill]");
    for (const el of blocks) {
      const slug = el.getAttribute("data-skill");
      if (!SKILLS_LOCKED[slug]) continue;
      try {
        const text = await decryptSkill(slug, password);
        const pre = document.createElement("pre");
        pre.className = "skill-plaintext";
        pre.textContent = text;
        el.replaceWith(pre);
      } catch (e) {
        /* leave locked */
      }
    }
    document.body.classList.add("skills-unlocked");
  }

  function wireForm() {
    const forms = document.querySelectorAll(".unlock-form");
    forms.forEach((form) => {
      const input = form.querySelector(".unlock-input");
      const btn = form.querySelector(".unlock-btn");
      const msg = form.querySelector(".unlock-msg");
      if (!input || !btn) return;

      async function attempt() {
        const pw = input.value;
        if (!pw) return;
        btn.disabled = true;
        btn.textContent = "Unlocking…";
        if (msg) msg.textContent = "";
        try {
          await unlockAll(pw);
          document.querySelectorAll(".unlock-form").forEach((f) => {
            f.innerHTML = '<p class="unlock-ok">Skill sources unlocked for this session.</p>';
          });
        } catch (e) {
          if (msg) msg.textContent = "That password didn't work.";
          btn.disabled = false;
          btn.textContent = "Unlock";
          input.select();
        }
      }

      btn.addEventListener("click", attempt);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); attempt(); }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireForm);
  } else {
    wireForm();
  }
})();
