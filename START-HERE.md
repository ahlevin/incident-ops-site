# START HERE — the two things to do before publishing

Plain steps. Do them once, in order. You'll need Terminal (Mac) or
PowerShell (Windows). Everything below is copy-paste.

---

## Before you start: put the two folders side by side

You downloaded two zips. Unzip both so they sit **next to each other**:

```
Documents/
  incident-ops-site/      <- the website (this goes to GitHub)
  skills-source/          <- your 22 skill .md files (NEVER goes to GitHub)
```

This matters. The skill sources must live outside the website folder so they
can never be committed by accident.

---

## Thing 1 — Set your real password

Right now the site is encrypted with a placeholder password. Replace it with
one only you know.

**When:** once, before you publish. Repeat any time you want to change the
password.

**How:**

1. Open Terminal.
2. Go to the website folder — type `cd ` (with a space), then drag the
   `incident-ops-site` folder onto the Terminal window and press Enter:

   ```
   cd /Users/you/Documents/incident-ops-site
   ```

3. Run this, replacing the words in quotes with your own password:

   ```
   node build/encrypt-skills.js "your-real-password-here"
   ```

   You should see: `Encrypted 22 skills.`

4. Save the change:

   ```
   git add js/skills-locked.js
   git commit -m "Rotate skill encryption"
   ```

**Pick a real password** — a phrase of several words is good
(`copper-harbor-lantern-49`). Write it down somewhere safe. If you lose it,
nobody can read the skills, including you — though you still have the
originals in `skills-source`, so you'd just re-run the command with a new one.

*If `node` isn't found:* install Node from https://nodejs.org (the "LTS"
button), then try again. Nothing else needs installing.

---

## Thing 2 — Turn the safety guard back on

The repo has a guard that blocks you from ever committing a skill's full text
by accident. Git doesn't carry guards across downloads, so it needs switching
on once on your machine.

**When:** once, right after unzipping. And again if you ever re-clone the repo
from GitHub onto another computer.

**How:** in Terminal, in the website folder:

```
git config core.hooksPath .githooks
```

That's it — no output means it worked.

**To check it's working**, run:

```
git config core.hooksPath
```

It should print `.githooks`.

---

## Then publish

1. Create a new **empty** repository on GitHub (don't tick "add a README").
2. In Terminal, in the website folder:

   ```
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source: `main`, folder: `/ (root)` → Save.**
4. A minute later your site is live at
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`

---

## Everyday use afterwards

**To share access with a recruiter:** just give them the password. They go to
any practice page, scroll to "Full skill sources", type it in, and the full
text appears for that browser session only.

**If you edit a skill:** edit the file in `skills-source`, then re-run Thing 1
to re-encrypt, then commit and push.

**One warning:** never copy a skill `.md` file into the website folder. The
guard will block the commit if you do, which is exactly what it's for.
