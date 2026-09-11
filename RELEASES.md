# Release tags and rollback

Every deploy overwrites `main` with a force-push, so branch history is not a
safety net. **Tags are.** A force-push to a branch does not delete tags, which
makes a tag the only durable rollback marker in this setup.

## Before every deploy: tag what's currently live

Run this in the folder that is currently deployed and working:

```
git tag -a vX.Y-known-good -m "What this version is. Deployed and verified."
git push origin vX.Y-known-good
```

Use the next number each time: `v1.0-known-good`, `v1.1-known-good`, and so on.
The message should say what the version contains, so future-you can pick the
right one without reading diffs.

## After deploying: verify, then tag the new state

Deploy, check the site actually works (pages load, mobile nav opens, the
password unlocks the skills), and only then tag it:

```
git tag -a vX.Y-known-good -m "..."
git push origin vX.Y-known-good
```

Tag *after* verification, never before. A tag on an unverified build is worse
than no tag, because it looks like a safe place to roll back to.

## To roll back

```
git fetch --tags
git tag -l                       # list what's available
git reset --hard v1.0-known-good # pick the tag you want
git push --force origin main
```

Then confirm on the live site before walking away.

## To look at a tag without rolling back

```
git checkout v1.0-known-good     # detached HEAD, look around safely
git checkout main                # return
```

## Tag log

Keep this list current. It is the human-readable version of `git tag -l`.

| Tag | Contents | Deployed |
|---|---|---|
| v1.0-known-good | Em-dash removal across site copy | 2026-09-11 |
| v1.1-known-good | Workflow diagrams on all three practice pages, maroon active-step accent | |
| v1.2-known-good | Link preview cards (Open Graph) for LinkedIn, Slack, iMessage | |

## Why not just use branch history

Because every deploy here is a force-push, which rewrites `main` and discards
what was there. That is a deliberate consequence of rebuilding the repo to keep
plaintext skill sources out of history. Tags are immune to it, so they carry
the rollback guarantee instead.
