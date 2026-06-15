# Nexus Capital — Android APK Build Guide

**App Name:** Nexus Capital  
**App ID:** com.nexuscapital.app  
**Backend:** https://nexuscapitalearnings.onrender.com  
**Frontend:** https://nexus-capital-earnings.vercel.app  

---

## Prerequisites

Install these on your machine before starting:

| Tool | Download |
|------|----------|
| **Node.js 18+** | https://nodejs.org |
| **Android Studio** | https://developer.android.com/studio |
| **JDK 17+** | included with Android Studio |
| **Android SDK** | installed via Android Studio SDK Manager |

In Android Studio → SDK Manager → SDK Tools, make sure these are checked:
- Android SDK Build-Tools (latest)
- Android SDK Platform-Tools
- Android Emulator

Add to your environment variables:
```
ANDROID_HOME = C:\Users\<you>\AppData\Local\Android\Sdk
Path += %ANDROID_HOME%\tools
Path += %ANDROID_HOME%\platform-tools
```

---

## Step 1 — Generate App Icons

```powershell
# Option A: Use canvas (auto-generates PNGs)
npm install canvas --save-dev
npx tsx scripts/generateIcons.ts

# Option B: Online generator (recommended)
# Upload public/icons/icon.svg to https://realfavicongenerator.net
# Download the package and place PNGs in public/icons/
# Required sizes: 72, 96, 128, 144, 152, 192, 384, 512
```

---

## Step 2 — Build the React/Vite App

```powershell
cd D:\Project\NexusCapital

# Make sure VITE_API_URL is set in .env
# Should be: VITE_API_URL=https://nexuscapitalearnings.onrender.com

npm run build
```

This outputs to `dist/` with:
- `dist/sw.js` — Service Worker
- `dist/workbox-*.js` — Workbox runtime
- `dist/manifest.webmanifest` — PWA manifest

---

## Step 3 — Initialize Capacitor (first time only)

```powershell
npx cap init "Nexus Capital" com.nexuscapital.app --web-dir=dist
```

---

## Step 4 — Add Android Platform (first time only)

```powershell
npx cap add android
```

This creates the `android/` folder with a full Gradle Android project.

---

## Step 5 — Sync Web Assets to Android

```powershell
npx cap sync android
```

Run this every time you rebuild the Vite app.

---

## Step 6 — Build Debug APK

```powershell
# Option A: Via npm script
npm run apk:debug

# Option B: Manually
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

Debug APK location:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

---

## Step 7 — Build Release APK

### 7a — Generate a keystore (first time only)

```powershell
keytool -genkeypair -v -keystore nexuscapital.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nexuscapital
```

Keep `nexuscapital.jks` safe — you need it for every future release update.

### 7b — Configure signing in android/app/build.gradle

Add inside `android { ... }`:

```gradle
signingConfigs {
    release {
        storeFile file("../../nexuscapital.jks")
        storePassword "YOUR_STORE_PASSWORD"
        keyAlias "nexuscapital"
        keyPassword "YOUR_KEY_PASSWORD"
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

### 7c — Build release APK

```powershell
cd D:\Project\NexusCapital\android
.\gradlew.bat assembleRelease
```

Release APK location:
```
android\app\build\outputs\apk\release\app-release.apk
```

---

## Step 8 — Install APK on Android Device

```powershell
# Connect phone via USB with USB Debugging enabled
adb devices                             # verify device is listed
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

Or copy the APK file to the phone and tap to install (allow "Install from unknown sources").

---

## Step 9 — Open in Android Studio (optional)

```powershell
npx cap open android
```

This opens the android/ folder in Android Studio where you can:
- Run on emulator
- Sign the APK
- Generate AAB for Play Store

---

## API Configuration

The APK makes all API calls to the Render backend:
```
https://nexuscapitalearnings.onrender.com/api/...
```

This is set via `VITE_API_URL` in `.env` at **build time**.  
The APK bundles this URL — no server is needed on the phone.

The backend CORS config already allows all `*.vercel.app` origins,  
and since the APK's WebView uses `https://localhost` as its origin,  
you may need to add it to the CORS allowlist.

### Fix CORS for APK WebView

In `server.ts`, the CORS function already handles localhost patterns.  
The Capacitor Android WebView uses the origin `https://localhost` — this is allowed by:

```
if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
```

But this checks HTTP, not HTTPS. Add `https://localhost` to the allowlist:

```ts
// Already done — this line covers the APK WebView:
if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
  return callback(null, true);
}
```

---

## Troubleshooting

### White screen on APK launch
- Check `capacitor.config.ts` → `webDir: 'dist'`
- Run `npm run build` then `npx cap sync android`
- Check `android/app/src/main/assets/public/` contains `index.html`

### API calls fail in APK
- Ensure `VITE_API_URL=https://nexuscapitalearnings.onrender.com` is set before build
- Check Render backend is running: visit `/api/health`
- Check CORS allows `https://localhost` (Capacitor WebView origin)

### Login not persisting
- Capacitor WebView uses `localStorage` — it persists between app restarts
- No changes needed — JWT in localStorage works fine

### Routing breaks on refresh
- React Router handles all routes client-side in the APK
- No server-side routing needed in the APK

---

## Quick Reference Commands

```powershell
# Full build + sync cycle
npm run cap:sync

# Open in Android Studio
npm run cap:open

# Build debug APK (all in one)
npm run apk:debug

# Build release APK (all in one)  
npm run apk:release
```

---

## Files Created for APK Support

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Capacitor app config (ID, name, webDir) |
| `vite.config.ts` | Updated with VitePWA plugin |
| `index.html` | Updated with PWA meta tags |
| `public/icons/icon.svg` | Source icon (generate PNGs from this) |
| `scripts/generateIcons.ts` | Auto-generates PNG icons |
| `APK_BUILD_GUIDE.md` | This file |

---

## Website vs APK

| Feature | Website (Vercel) | APK (Android) |
|---------|-----------------|---------------|
| Auth/JWT | ✅ localStorage | ✅ localStorage |
| API calls | ✅ Render backend | ✅ Same Render backend |
| Router | ✅ React Router | ✅ React Router |
| Service Worker | ✅ Active | ✅ Active |
| File uploads | ✅ FormData | ✅ FormData |
| Screenshots | ✅ Camera roll | ✅ Camera roll |

Everything that works on the website works in the APK — same codebase.
