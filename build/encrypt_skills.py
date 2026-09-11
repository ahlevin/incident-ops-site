#!/usr/bin/env python3
"""
Encrypt SKILL.md sources for the website.

Produces js/skills-locked.js containing only AES-GCM ciphertext.
The password is NEVER written to disk, the repo, or the page — it is
supplied at build time and again by the visitor in their browser.

Usage:
    python3 build/encrypt_skills.py "your-passphrase"

Crypto: PBKDF2-HMAC-SHA256 (310,000 iterations) -> 256-bit AES-GCM key.
Salt and IV are random per skill and stored alongside the ciphertext
(neither is secret). Matches the Web Crypto API on the browser side.
"""
import base64
import json
import os
import sys
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

ITERATIONS = 310_000
SITE = Path(__file__).resolve().parent.parent

# slug -> source SKILL.md path
SKILL_SOURCES = {
    # service desk
    "service-desk-intake": "/home/claude/sd/service-desk-intake/SKILL.md",
    "first-touch-resolution": "/home/claude/sd/first-touch-resolution/SKILL.md",
    "service-request-fulfillment": "/home/claude/sd/service-request-fulfillment/SKILL.md",
    "service-desk-escalation": "/home/claude/sd/service-desk-escalation/SKILL.md",
    "service-desk-user-communication": "/home/claude/sd/service-desk-user-communication/SKILL.md",
    "ticket-closure-satisfaction": "/home/claude/sd/ticket-closure-satisfaction/SKILL.md",
    "service-desk-performance": "/home/claude/sd/service-desk-performance/SKILL.md",
    "self-service-knowledge-assistant": "/home/claude/sd/self-service-knowledge-assistant/SKILL.md",
    # incident & problem
    "incident-triage-classification": "/home/claude/incident-triage-classification/SKILL.md",
    "incident-status-updates": "/home/claude/incident-status-updates/SKILL.md",
    "incident-diagnosis-engine": "/home/claude/incident-diagnosis-engine/SKILL.md",
    "incident-resolution-closure": "/home/claude/incident-resolution-closure/SKILL.md",
    "problem-record-priority": "/home/claude/problem-record-priority/SKILL.md",
    "incident-root-cause-analysis": "/home/claude/incident-root-cause-analysis/SKILL.md",
    "known-error-record": "/home/claude/known-error-record/SKILL.md",
    # change enablement
    "change-intake-classification": "/home/claude/chg/change-intake-classification/SKILL.md",
    "change-risk-assessment": "/home/claude/chg/change-risk-assessment/SKILL.md",
    "change-authorization": "/home/claude/chg/change-authorization/SKILL.md",
    "change-schedule-conflict": "/home/claude/chg/change-schedule-conflict/SKILL.md",
    "change-implementation-rollback": "/home/claude/chg/change-implementation-rollback/SKILL.md",
    "emergency-change": "/home/claude/chg/emergency-change/SKILL.md",
    "post-implementation-review": "/home/claude/chg/post-implementation-review/SKILL.md",
}


def encrypt(plaintext: str, password: str) -> dict:
    salt = os.urandom(16)
    iv = os.urandom(12)
    key = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=ITERATIONS,
    ).derive(password.encode("utf-8"))
    ct = AESGCM(key).encrypt(iv, plaintext.encode("utf-8"), None)
    b64 = lambda b: base64.b64encode(b).decode("ascii")
    return {"s": b64(salt), "i": b64(iv), "c": b64(ct)}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    password = sys.argv[1]

    payload = {}
    missing = []
    for slug, path in SKILL_SOURCES.items():
        p = Path(path)
        if not p.exists():
            missing.append(slug)
            continue
        payload[slug] = encrypt(p.read_text(), password)

    out = SITE / "js" / "skills-locked.js"
    out.write_text(
        "// AES-GCM ciphertext only. No plaintext, no password.\n"
        "// Regenerate with: python3 build/encrypt_skills.py \"<passphrase>\"\n"
        f"const SKILL_ITERATIONS = {ITERATIONS};\n"
        "const SKILLS_LOCKED = " + json.dumps(payload, indent=0) + ";\n"
    )

    print(f"encrypted {len(payload)} skills -> {out}")
    if missing:
        print("MISSING SOURCES:", ", ".join(missing))


if __name__ == "__main__":
    main()
