# Play Console — Data Safety Form Answer Key (Daniel Fast)

Copy these answers into **Play Console → App content → Data safety**. They reflect the
app as built: all data is stored locally on the device and nothing is transmitted off
the device. Keep this file updated if you ever add analytics, crash reporting, ads, or
cloud sync — any of those would change the answers.

## Section 1: Data collection and security

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **No** |
| Is all of the user data collected by your app encrypted in transit? | N/A — no data is collected or transmitted. (If the form forces an answer, select **Yes**, since no data leaves the device.) |
| Do you provide a way for users to request that their data be deleted? | **Yes** — users delete all data in-app (Clear History / Reset / Change Fast Length) or via Android Settings → Clear data, or by uninstalling. |

> Google's definition: data that is only stored on the device and **never sent off the
> device** is **not** "collected." Daniel Fast stores fasting/hydration/reading progress
> only in on-device local storage, so you answer **No** to data collection.

## Section 2: Data types — declare NONE

Because nothing is collected or shared, you do **not** declare any of these:

- Location — **No**
- Personal info (name, email, user IDs, address, phone) — **No**
- Financial info — **No**
- Health and fitness — **No** *(fasting/water data stays on-device, so it is not "collected")*
- Messages, Photos/videos, Audio, Files — **No**
- Calendar, Contacts — **No**
- App activity / app info & performance (analytics, crash logs) — **No**
- Device or other IDs (incl. advertising ID) — **No**

## Section 3: Privacy policy

- A privacy policy URL is **required** for every app. Host `PRIVACY_POLICY.md` at a
  public URL and enter it in **Play Console → App content → Privacy policy** AND in the
  store listing. Make sure the in-app `PRIVACY_URL` constant matches that URL.

## Related declarations (App content section)

- **Ads**: No ads. → "No, my app does not contain ads."
- **App access**: No login required → "All functionality is available without special access."
- **Content rating questionnaire**: Complete it. Religious/wellness content, no violence,
  no user-generated content, no purchases. Likely **Everyone**.
- **Target audience & content**: Not designed for children → target 18+ or 13+ (your call),
  and do not opt into the Designed for Families program.
- **Health apps declaration**: If the Health Apps declaration appears for your category,
  declare it honestly: a lifestyle/wellness fasting tracker, **not** a medical device,
  does not provide medical advice (the in-app disclaimer backs this up). It does not access
  Health Connect or any health API.
- **Government apps / Financial features / News**: No.
- **Data deletion (Account deletion policy)**: Your app has no accounts, so the web-based
  account-deletion requirement does not apply; on-device deletion (above) is sufficient.
