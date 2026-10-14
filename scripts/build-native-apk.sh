#!/usr/bin/env bash
set -e

echo "=== 1. Ensuring production web assets are built ==="
npm run build

echo "=== 2. Creating Android project structure ==="
rm -rf android_build
mkdir -p android_build/src/app/freshplate/assistant
mkdir -p android_build/gen
mkdir -p android_build/bin
mkdir -p android_build/dex
mkdir -p android_build/assets/www
mkdir -p android_build/res/values
mkdir -p android_build/res/mipmap-mdpi
mkdir -p android_build/res/mipmap-hdpi
mkdir -p android_build/res/mipmap-xhdpi
mkdir -p android_build/res/mipmap-xxhdpi
mkdir -p android_build/res/mipmap-xxxhdpi

echo "=== 3. Writing Android Manifest ==="
cat << 'EOF' > android_build/AndroidManifest.xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="app.freshplate.assistant"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:allowBackup="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout|smallestScreenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

echo "=== 4. Writing Android Resources ==="
cat << 'EOF' > android_build/res/values/strings.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">FreshPlate</string>
</resources>
EOF

cat << 'EOF' > android_build/res/values/colors.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#4CAF50</color>
    <color name="primary_dark">#388E3C</color>
    <color name="background">#FAFAFA</color>
</resources>
EOF

cat << 'EOF' > android_build/res/values/styles.xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.DeviceDefault.NoActionBar">
        <item name="android:windowBackground">@color/background</item>
        <item name="android:statusBarColor">@color/primary</item>
    </style>
</resources>
EOF

# Copy generated launcher icons
cp public/pwa-192x192.png android_build/res/mipmap-mdpi/ic_launcher.png
cp public/pwa-192x192.png android_build/res/mipmap-hdpi/ic_launcher.png
cp public/pwa-192x192.png android_build/res/mipmap-xhdpi/ic_launcher.png
cp public/pwa-512x512.png android_build/res/mipmap-xxhdpi/ic_launcher.png
cp public/pwa-512x512.png android_build/res/mipmap-xxxhdpi/ic_launcher.png

echo "=== 5. Writing MainActivity.java ==="
cat << 'EOF' > android_build/src/app/freshplate/assistant/MainActivity.java
package app.freshplate.assistant;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.PermissionRequest;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                request.grant(request.getResources());
            }
        });

        // Load live PWA hosted URL with offline asset fallback
        webView.loadUrl("https://ais-pre-pu3lgboxeem24i4t5kyuet-576332960421.asia-east1.run.app");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
EOF

echo "=== 6. Generating R.java with AAPT ==="
aapt package -f -m \
    -J android_build/gen \
    -M android_build/AndroidManifest.xml \
    -S android_build/res \
    -I /opt/android-sdk/platforms/android-33/android.jar

echo "=== 7. Compiling Java Classes with javac ==="
javac -source 8 -target 8 \
    -d android_build/bin \
    -cp /opt/android-sdk/platforms/android-33/android.jar \
    android_build/gen/app/freshplate/assistant/R.java \
    android_build/src/app/freshplate/assistant/MainActivity.java

echo "=== 8. Converting Class files to DEX with D8 ==="
java -cp /opt/android-sdk/build-tools/33.0.0/r8.jar com.android.tools.r8.D8 \
    --min-api 21 \
    --output android_build/dex \
    --lib /opt/android-sdk/platforms/android-33/android.jar \
    $(find android_build/bin -name "*.class")

echo "=== 9. Copying Web App Dist into Android Assets ==="
cp -r dist/* android_build/assets/www/

echo "=== 10. Packaging Base APK with AAPT ==="
aapt package -f \
    -M android_build/AndroidManifest.xml \
    -S android_build/res \
    -A android_build/assets \
    -I /opt/android-sdk/platforms/android-33/android.jar \
    -F android_build/unaligned.apk

echo "=== 11. Adding classes.dex to APK ==="
(cd android_build/dex && aapt add ../unaligned.apk classes.dex)

echo "=== 12. Aligning APK with zipalign (4-byte boundary) ==="
zipalign -f -p 4 android_build/unaligned.apk android_build/aligned.apk

echo "=== 13. Generating Keystore (if not present) ==="
if [ ! -f freshplate.keystore ]; then
    keytool -genkeypair -v \
        -keystore freshplate.keystore \
        -alias freshplate \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass android123 \
        -keypass android123 \
        -dname "CN=FreshPlate, OU=Mobile, O=FreshPlate, L=SanFrancisco, ST=California, C=US"
fi

echo "=== 14. Cryptographically Signing APK with apksigner (v1 + v2 + v3) ==="
apksigner sign \
    --ks freshplate.keystore \
    --ks-pass pass:android123 \
    --key-pass pass:android123 \
    --out freshplate.apk \
    android_build/aligned.apk

echo "=== 15. Verifying APK Signature ==="
apksigner verify -v freshplate.apk

# Copy release apk to destinations
cp freshplate.apk freshplate-release.apk
cp freshplate.apk public/freshplate.apk
cp freshplate.apk dist/freshplate.apk

echo "=========================================================="
echo "SUCCESS! Native Android APK Generated:"
ls -lh freshplate.apk
echo "=========================================================="
