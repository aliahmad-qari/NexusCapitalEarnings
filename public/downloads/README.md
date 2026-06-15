# APK distribution folder

Place the built Android APK here so it ships with the site and is downloadable
from `/download-app`.

## Expected file

```
public/downloads/nexus-capital.apk
```

This exact filename/path is referenced by `src/utils/apkConfig.ts` (`APK_INFO.apkPath`).
Vite copies everything under `public/` into `dist/` verbatim, so on Vercel the
file is served at `https://<your-domain>/downloads/nexus-capital.apk`.

## How to produce the APK (on a machine with Android Studio + JDK 17)

```bash
# 1. Ensure VITE_API_URL points to the production backend (NOT localhost)
#    .env →  VITE_API_URL=https://nexuscapitalearnings.onrender.com

# 2. Build web + sync + assemble
npm run apk:release          # build + cap sync + gradlew assembleRelease
# (or npm run apk:debug for an unsigned debug build)

# 3. Copy the output here
#    android/app/build/outputs/apk/release/app-release.apk
#      →  public/downloads/nexus-capital.apk

# 4. Update version/size in src/utils/apkConfig.ts if needed, rebuild the web app,
#    and redeploy to Vercel.
```

Until `nexus-capital.apk` exists at this path, the landing page button and the
`/download-app` page automatically show a **"Coming Soon"** state — no code change
is needed when you add the file.
