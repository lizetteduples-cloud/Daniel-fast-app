# Daniel Fast — Play Store Launch Checklist

App ID: `app.fastingflow.android` · Display name: **Daniel Fast** · Category: Health & Fitness (or Lifestyle)

## ✅ Already done in the build

- Renamed to **Daniel Fast** (display name only; package id unchanged so future updates work).
- Native **Capacitor Local Notifications** with web fallback (daily-repeating reminders).
- All user data stays **on-device** (local storage) — no network, no analytics, no SDKs.
- In-app **health disclaimer** + **privacy link** added under Settings.
- Soft light, readable theme.

## ⚠️ Do before you submit

- [ ] Host `PRIVACY_POLICY.md` at a public URL; fill in your contact email.
- [ ] Set `PRIVACY_URL` in `www/index.html` to that same URL, then `npm run sync`.
- [ ] Confirm `android/release-upload-key.jks` + `android/keystore.properties` are backed up privately (you cannot update the app without them).
- [ ] Build the signed release: `npm run sync` then `npm run android:bundle` → `android/app/build/outputs/bundle/release/app-release.aab`.
- [ ] In `android/app/build.gradle`, confirm `targetSdkVersion` meets Google's current minimum (35 for new apps in 2025; check the requirement page below).

---

## 1. Test early and often

**a) Internal testing (instant, up to 100 testers).** Use this first for fast bug feedback.
- Play Console → Testing → **Internal testing** → create release → upload the `.aab`.
- Add testers by email (an email list works). Share the opt-in link, install, and run through the checklist below.

**b) Closed testing — the 14-day requirement.** New **personal** developer accounts (created since Nov 2023) must run a closed test with **at least 12 testers opted in for 14 continuous days** before you can apply for production access. (Company/organisation accounts are exempt.)
- Play Console → Testing → **Closed testing** → create a track → add ≥12 testers → keep them opted in and active for 14 days.
- Then Play Console will show **"Apply for production."**

**Tester checklist (give this to your testers):**
- First launch → choose fast length (10/15/21) → day boxes appear.
- Start a fast; backdate with "I Forgot"; schedule a future fast; end a fast (logs to History).
- Enable a reminder bell on a water and a tea time → confirm a notification fires (incl. with app closed).
- Water/Rooibos counters + "did you know" facts.
- Bible tab: open a day, mark complete, reset.
- Close & reopen the app → progress persists.
- Works offline (airplane mode) after first launch.
- Looks right on a small phone screen.

## 2. Build secure apps and be transparent

**Play Integrity API — honest take for this app:** Play Integrity proves an app/device is
genuine by returning a verdict that **your backend** checks. Daniel Fast has **no backend
and no accounts or paid content to protect**, so adding Play Integrity now would be
decorative (nothing would consume the verdict). **Recommendation: skip it for v1.** Revisit
only if you later add a server, logins, in-app purchases, or premium content. The security
practices that *do* apply to you:
- Keep the upload/signing keystore private and backed up; never commit it.
- Use **Play App Signing** (default for new apps) so Google manages the release key.
- Target a current `targetSdkVersion`; don't request permissions you don't use (you only use notifications + internet).
- All remote links are HTTPS (Bible.com). No mixed/insecure content; scripts are vendored locally.

**Data safety form:** complete it using `DATA_SAFETY.md` — the answer is **no data collected
or shared**, with a privacy-policy URL. Complete the **Health apps** declaration honestly
(wellness tracker, not a medical device — the in-app disclaimer supports this).

## 3. Comply and stay in control

**Policy updates:** subscribe to Play Console notifications and skim the Developer Program
Policy + Health apps + Families policies before each submission. Health/wellness wording
must avoid medical claims — your disclaimer (in-app, store listing, and privacy policy)
covers this; keep it.

**Managed publishing (control your go-live):**
- Play Console → **Publishing overview** → turn **Managed publishing ON**.
- With it on, reviewed changes are **held** until you press **Publish** — so you decide the
  exact moment the app or an update goes live, even after Google approves it.

---

## Store listing draft

**App name:** Daniel Fast

**Short description (≤80 chars):**
```text
Fasting, hydration, Rooibos & devotional tracker for a 10/15/21-day journey.
```

**Full description:**
```text
Daniel Fast helps you follow a 10, 15 or 21-day fasting rhythm with simple daily tracking: a fasting timer (16:8), water and Rooibos tea goals, a guided Bible reading plan with devotionals, animated day-by-day progress, reminders, and a fasting history.

Everything is stored privately on your device — no account, no ads, and your data is never collected or shared.

This app is for general wellness and spiritual reflection. It is not medical advice, does not diagnose or treat any condition, and is not a medical device. Please speak to a qualified healthcare professional before fasting if you are pregnant or breastfeeding, under 18, diabetic, on medication, or managing a medical condition.
```

**Other listing items:** app icon (have it), feature graphic 1024×500, 2–8 phone screenshots
(grab from the running app: Journey, Timer, Hydration, Bible), content rating questionnaire,
privacy policy URL, ads = No.

## Build & upload commands
```powershell
cd C:\Users\Admin\Dev\fastingflow-android
npm run sync
npm run android:bundle
# → android/app/build/outputs/bundle/release/app-release.aab  (upload this)
```
