# Invitation site + admin

Google Apps Script backend, with the guest-facing pages hosted on GitHub Pages and the admin available only as a Windows app or Android app — never on the web.

- **Guests:** `i/` — the invitation and RSVP page, published on GitHub Pages.
- **Bride & groom:** `c/` — the read-only replies/photos page, published on GitHub Pages.
- **Admin:** not published anywhere. Its source lives in `admin-src/` (git-ignored, this machine only) and is built into:
  - **Windows:** `cd app && npm install && npm run build:exe` → `app/dist/Invitation-Admin.exe`
  - **Android:** `cd app && npm install && npm run build:apk` (needs a JDK + Android SDK) → `app/android/app/build/outputs/apk/debug/app-debug.apk`

`app/local-config.json` (git-ignored) pre-bakes the Apps Script link + admin key into a build so it opens straight to the events list, with no sign-in screen. Without it, the app asks for the link and key on first run and remembers them on that device only.

Rebuilding requires `admin-src/` to exist locally (index.html, manifest.webmanifest, sw.js, icon-192.png, icon-512.png) — ask for a fresh copy if it's missing.
