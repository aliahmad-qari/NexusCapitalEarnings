// ─────────────────────────────────────────────────────────────────────────────
//  APK distribution config — single source of truth for the Android download flow
//
//  The actual .apk binary is produced on a machine with Android Studio + JDK 17
//  (`npm run apk:release`) and then placed at  public/downloads/nexus-capital.apk
//  so Vite copies it into dist/ and Vercel serves it as a static file.
//
//  Until that file exists, the download UI automatically shows a "Coming Soon"
//  state — nothing here needs to change when the APK is added.
// ─────────────────────────────────────────────────────────────────────────────

export const APK_INFO = {
  appName: 'Nexus Capital',
  appId: 'com.nexuscapital.app',
  version: '1.0.0',
  // Public path (served from dist/ on Vercel). Keep in sync with the file you upload.
  apkPath: '/downloads/nexus-capital.apk',
  // Human-readable approximate size shown on the download page until a real size
  // is resolved from the file's Content-Length at runtime.
  approxSize: '~8 MB',
  // Internal route that hosts the rich download page.
  downloadPageRoute: '/download-app',
  minAndroid: 'Android 6.0+',
} as const;

export interface ApkAvailability {
  available: boolean;
  /** Bytes from the HEAD Content-Length, when the server provides it. */
  sizeBytes: number | null;
  /** Whether the check has finished (false while in-flight). */
  checked: boolean;
}

/**
 * Probe whether the APK is actually hosted, without downloading it.
 * Uses a HEAD request; treats any non-2xx / network error as "not available"
 * so the UI gracefully falls back to a "Coming Soon" state.
 */
export async function checkApkAvailable(
  signal?: AbortSignal
): Promise<ApkAvailability> {
  try {
    const res = await fetch(APK_INFO.apkPath, { method: 'HEAD', signal });
    if (!res.ok) return { available: false, sizeBytes: null, checked: true };

    // Guard against SPA fallback: some hosts return index.html (200, text/html)
    // for missing files. A real APK is an octet-stream / android package.
    const type = res.headers.get('content-type') || '';
    if (type.includes('text/html')) {
      return { available: false, sizeBytes: null, checked: true };
    }

    const len = res.headers.get('content-length');
    return {
      available: true,
      sizeBytes: len ? Number(len) : null,
      checked: true,
    };
  } catch {
    return { available: false, sizeBytes: null, checked: true };
  }
}

/** Format a byte count as a compact MB string, falling back to the approx size. */
export function formatApkSize(sizeBytes: number | null): string {
  if (!sizeBytes || sizeBytes <= 0) return APK_INFO.approxSize;
  const mb = sizeBytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}
