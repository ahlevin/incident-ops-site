# Redeploy — read this first

This zip contains the full site with the mobile navigation fixes.

**Important:** it ships with a placeholder password, so **step 2 is not
optional.** If you skip it, your real password stops working.

---

## Step 1 — Replace your folder

Delete (or rename) your old `incident-ops-site` folder, unzip this one in
its place.

Your `skills-source` folder stays where it is — don't touch it.

---

## Step 2 — Set your real password

In Terminal:

```
cd /Users/alanlevin/Downloads/incident-ops-site
node build/encrypt-skills.js 'YOUR-REAL-PASSWORD'
```

Replace `YOUR-REAL-PASSWORD` with your actual password, keeping the single
quotes. You should see `Encrypted 22 skills.`

*If it says it can't find the skill sources folder*, make sure
`skills-source` sits next to `incident-ops-site`, not inside it.

---

## Step 3 — Turn the safety guard on

```
git config core.hooksPath .githooks
```

Needed every time you start from a fresh copy — Git doesn't carry hooks
across downloads.

---

## Step 4 — Connect to GitHub

```
git remote add origin https://github.com/ahlevin/incident-ops-site.git
```

---

## Step 5 — Commit and push

```
git add -A
git commit -m "Mobile navigation fixes"
git push --force origin main
```

`--force` is required: this folder has its own history, and it replaces
what's on GitHub. That's intended.

---

## Step 6 — Check it

Wait about a minute, then:

1. **https://github.com/ahlevin/incident-ops-site/settings/pages** — confirm
   `alanlevin.dev` is still in Custom domain and **Enforce HTTPS** is ticked.
   A force-push occasionally clears it; if so, type it back and save.
2. **https://alanlevin.dev on your phone, in a Private tab** — tap the
   hamburger. Links should line up under your name, not against the edge.
3. **Unlock check** — scroll to "Full skill sources" on any practice page
   and confirm your real password works.

---

## What changed in this version

- Mobile hamburger menu on all five pages
- Fixed nav panel alignment (was flush against the left edge)
- Added `env()` fallbacks so padding works on all browsers
- CNAME file included, so the custom domain survives the redeploy
