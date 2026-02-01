# 🚀 Mobile Deployment Guide (Android Play Store)

This guide walks you through deploying your Expense Tracker Pro app to the Google Play Store using Expo EAS.

## Prerequisites
1.  **Google Play Developer Account**: You need a paid account ($25 one-time fee) at [play.google.com/console](https://play.google.com/console).
2.  **Expo Account**: Sign up at [expo.dev](https://expo.dev).
3.  **EAS CLI**: Installed via `npm install -g eas-cli`.

---

## Step 1: Login & Configure
Run these commands in your terminal:

1.  **Login to Expo:**
    ```bash
    npx eas-cli login
    ```

2.  **Configure the Project:**
    (I have already configured `eas.json` and `app.json` for you, but run this to link your project)
    ```bash
    npx eas-cli build:configure
    ```

---

## Step 2: Create a Production Build
To generate the **Android App Bundle (.aab)** required by the Play Store:

1.  **Important**: Switch to the native app directory:
    ```bash
    cd apps/expo
    ```

2.  Run the build command:
    ```bash
    npx eas-cli build --platform android --profile production
    ```

-   During this process, EAS will ask to generate a **Keystore**. Select **"Yes"** to let Expo handle it securely.
-   Wait for the build to finish (it runs in the cloud).
-   Once done, it will give you a download link for the `.aab` file.

## Step 2.5: Create a Test APK (Optional)
If you want to install the app on your phone directly without the Play Store:

```bash
npx eas-cli build --platform android --profile preview
```
-   This generates an **.apk** file.
-   Download it and install it on your Android device (you may need to allow installs from unknown sources).

---

## Step 3: Upload to Play Store

### Option A: Manual Upload (First Time)
1.  Go to **Google Play Console** > **Create App**.
2.  Fill in the app details (Name, Language, etc.).
3.  Go to **Production** (or Internal Testing) > **Create new release**.
4.  Upload the `.aab` file you downloaded from Expo.
5.  Complete the store listing details (Screenshots, Description, Content Rating).
6.  Submit for review!

### Option B: Automated Submit (EAS Submit)
Once you have manually uploaded the first version, you can automate future updates:

1.  **Generate a Google Service Account Key** ([Guide Here](https://docs.expo.dev/submit/android/)).
2.  Run:
    ```bash
    npx eas-cli submit --platform android
    ```
    (It will ask for your `.json` key the first time).

---

## Common Issues
-   **Package Name Conflict**: If `com.akthakur4744.expensetrackerpro` is taken (unlikely), change `package` in `app.json`.
-   **Version Code**: For every new update, increase `"versionCode"` in `app.json` (Android section) or let EAS manage it.
