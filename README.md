# Alan Levin — operational process + AI

A static site: the thesis that core operational processes should be optimized
with AI, one page per ITIL practice area as each is built, plus a résumé.
No backend, no build step, no API costs.

## Pages

```
index.html              Home — who I am + the process/applications/AI thesis
incident-problem.html   Practice area: incident & problem management (7 skills)
resume.html             Full record of service
files/                  Résumé PDF
css/style.css           All styling
js/demo-data.js         Content for the runnable skill demo
js/main.js              Demo console (run all / step through)
js/flow.js              Integration architecture flow animation
```

## Adding a new practice area page

1. Copy `incident-problem.html` as a starting point — it has the shared
   header, case-file bar, and footer already in place.
2. Add a link to the new page in the `<nav class="topnav">` block. **This
   block is duplicated in every page**, so update all of them (there's no
   build step doing it for you).
3. Add a card to the `practice-list` on `index.html`, moving it from
   "Planned" to "Built" (drop the `practice-built` class for unbuilt ones).

## Running it locally

No build step — open `index.html` directly, or:

```
python3 -m http.server 8000
```

## Publishing for free

**GitHub Pages**
1. Create a repo on GitHub (don't initialize with a README).
2. `git remote add origin <your-repo-url>` then `git push -u origin main`.
3. Settings → Pages → source: `main` branch, root folder.

**Netlify or Vercel** — connect the repo, no build command, publish
directory is the repo root.

## Notes

- Fonts (Special Elite, Courier Prime) load from Google Fonts.
- The demo and flow animations are scripted, not live model calls — nothing
  is metered, so traffic costs nothing.
- Phone number is in the résumé PDF but deliberately not in page text.
