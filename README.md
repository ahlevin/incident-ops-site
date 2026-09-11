# Alan Levin — operational process + AI

Static site. No backend, no build step for the pages themselves, no API costs.

## Security model for skill sources

The full SKILL.md instructions are **never committed to this repository in
plaintext**. Three layers enforce that:

1. **Encryption at build time.** `build/encrypt_skills.py` reads the SKILL.md
   files from *outside* this repo and emits `js/skills-locked.js` containing
   only AES-256-GCM ciphertext. Key derivation is PBKDF2-HMAC-SHA256 at
   310,000 iterations. Salt and IV are random per skill (neither is secret).
   The passphrase is never written to disk, the page, or the repo.

2. **Client-side unlock.** `js/skill-unlock.js` derives the key in the browser
   via the Web Crypto API and decrypts in memory only. Nothing is cached to
   localStorage or sessionStorage — closing the tab re-locks it.

3. **A pre-commit guard.** `.githooks/pre-commit` blocks any commit containing
   markdown structures unique to SKILL.md files. Enabled via
   `git config core.hooksPath .githooks` (already set locally; **re-run this
   after cloning**, since hooks don't transfer with a clone).

What *is* public: the "why this skill exists" rationale for each skill, shown
as an excerpt. That's deliberate — it demonstrates the work is real without
giving away the operational detail.

### Honest limits
Client-side encryption stops scraping, search indexing and repo browsing. It
does **not** stop someone who has the password from copying the decrypted
text. Only server-side gating would, and that requires a backend.

## Before publishing

```
python3 build/encrypt_skills.py "your-real-passphrase"
git add js/skills-locked.js && git commit -m "Rotate skill encryption"
```

The repository currently ships with a **placeholder passphrase**
(`change-me-before-publishing`). Rotate it before going live.

**This repo has intentionally clean history** — a single initial commit. Do not
restore or merge any earlier history, which contained plaintext skill sources.

## Pages

```
index.html                Home — thesis and practice areas
service-desk.html         Service desk (8 skills)
incident-problem.html     Incident & problem management (7 skills)
change-enablement.html    Change enablement (7 skills)
resume.html               Record of service
files/                    Résumé PDF
build/encrypt_skills.py   Encrypts skill sources -> ciphertext
js/skills-locked.js       Ciphertext only (generated)
js/skill-unlock.js        Browser-side decryption
```

## Running locally

```
python3 -m http.server 8000
```

## Publishing (free)

**GitHub Pages** — push, then Settings → Pages → source `main`, root folder.
**Netlify / Vercel** — connect the repo, no build command, publish root.
