# Daniel Fast (Android)

Capacitor Android package for the Daniel Fast web app (formerly "FastingFlow").
The Android package id remains `app.fastingflow.android` so existing installs/updates keep working; only the display name changed.

## What This Contains

- `www/index.html`: the Daniel Fast single-file React app
- `www/vendor`: local React, ReactDOM and Babel scripts
- `capacitor.config.json`: Android app ID and Capacitor config
- `assets/app-icon.svg`: source icon for generated app icons
- `tools`: small checks for icons and local web assets

## Current Status

- Capacitor packages are installed in `node_modules`.
- The Android project has been generated in `android`.
- Web assets have been synced into `android/app/src/main/assets/public`.
- Daniel Fast launcher and splash assets have replaced the default Capacitor artwork.
- Local web bundle verification passes.
- Android Studio's bundled JDK is configured for Gradle through `android/gradle.properties`.
- A local upload key has been generated at `android/release-upload-key.jks`.
- Release signing credentials are stored locally in `android/keystore.properties`.
- The signed release `.aab` builds successfully.

## Setup

Install these first:

- Node.js LTS with npm
- Android Studio
- Android SDK Platform 35 or newer
- JDK available to Android Studio

Then run:

```powershell
npm install
npm run verify:www
npm run android:add
npm run sync
npm run android:open
```

In Android Studio, let Gradle sync finish, connect a phone or emulator, then press Run.

## Build AAB For Play Store

After Android Studio works:

```powershell
npm run sync
npm run android:bundle
```

The unsigned/release bundle path is normally:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Current signed bundle:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Important: back up both of these privately before publishing:

```text
android/release-upload-key.jks
android/keystore.properties
```

Do not share these files publicly. The `.jks` file and passwords are needed to sign future app updates.

## Important App Notes

- Reminders use **Capacitor Local Notifications** (`@capacitor/local-notifications`) on Android, with an automatic fall back to the browser `Notification` API when run as a plain web page (e.g. local preview). Native reminders are scheduled as **daily-repeating** OS notifications, so water/tea nudges and the fast-complete alert fire even when the app is closed. The plugin merges `POST_NOTIFICATIONS` (Android 13+), `RECEIVE_BOOT_COMPLETED`, and `WAKE_LOCK` into the manifest at build time — Android 13+ will prompt for notification permission the first time a reminder is enabled.
- Keep health/wellness wording careful: add a privacy policy, health disclaimer, and Play Console health declaration before release.
