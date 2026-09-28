# Invitation Admin

Admin for the wedding invitation site (Google Apps Script backend). One web app, three ways to use it:

- **Web / installable:** GitHub Pages — open the site, then "Add to Home screen" / "Install".
- **Windows:** `cd app && npm install && npm run build:exe` → `app/dist/Invitation-Admin.exe`
- **Android:** `cd app && npm install && npm run build:apk` (needs JDK 21 + Android SDK) → `app/android/app/build/outputs/apk/debug/app-debug.apk`

Sign in with the Apps Script web app link (ends in `/exec`) and your admin PIN. No secrets are stored in this repo.
