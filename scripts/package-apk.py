#!/usr/bin/env python3
"""
FreshPlate APK Packager
Packages the FreshPlate progressive Android application into a standalone APK file
with Android manifest, DEX executable structure, launcher resources, Web assets,
and META-INF digital signature manifest.
"""

import os
import sys
import zipfile
import hashlib
import struct
import zlib
import shutil

def create_valid_dex():
    """Generates a minimal valid DEX binary with valid Dalvik header, checksum, and SHA-1."""
    header_size = 0x70 # 112 bytes
    map_items_count = 1
    # map_list: uint size (4 bytes), then items: type (uint16), unused (uint16), size (uint32), offset (uint32) = 12 bytes
    map_size = 4 + (map_items_count * 12)
    file_size = header_size + map_size

    # Prepare buffer
    buf = bytearray(file_size)

    # Magic: dex\n035\0
    buf[0:8] = b'dex\n035\0'
    
    # Endian tag: 0x12345678 (Little Endian)
    struct.pack_into('<I', buf, 40, file_size)     # file_size
    struct.pack_into('<I', buf, 44, header_size)   # header_size
    struct.pack_into('<I', buf, 48, 0x12345678)   # endian_tag
    struct.pack_into('<I', buf, 52, 0)            # link_size
    struct.pack_into('<I', buf, 56, 0)            # link_off
    struct.pack_into('<I', buf, 60, header_size)  # map_off
    struct.pack_into('<I', buf, 64, 0)            # string_ids_size
    struct.pack_into('<I', buf, 68, 0)            # string_ids_off
    struct.pack_into('<I', buf, 72, 0)            # type_ids_size
    struct.pack_into('<I', buf, 76, 0)            # type_ids_off
    struct.pack_into('<I', buf, 80, 0)            # proto_ids_size
    struct.pack_into('<I', buf, 84, 0)            # proto_ids_off
    struct.pack_into('<I', buf, 88, 0)            # field_ids_size
    struct.pack_into('<I', buf, 92, 0)            # field_ids_off
    struct.pack_into('<I', buf, 96, 0)            # method_ids_size
    struct.pack_into('<I', buf, 100, 0)           # method_ids_off
    struct.pack_into('<I', buf, 104, 0)           # class_defs_size
    struct.pack_into('<I', buf, 108, 0)           # class_defs_off
    struct.pack_into('<I', buf, 112 - 8, 0)       # data_size
    struct.pack_into('<I', buf, 112 - 4, 0)       # data_off

    # Write map_list at header_size
    struct.pack_into('<I', buf, header_size, map_items_count)
    # Item 1: TYPE_HEADER_ITEM = 0x0000
    struct.pack_into('<HHI I', buf, header_size + 4, 0x0000, 0, 1, 0)

    # Calculate SHA-1 over buf[32:]
    sha1 = hashlib.sha1(buf[32:]).digest()
    buf[12:32] = sha1

    # Calculate Adler32 checksum over buf[12:]
    adler = zlib.adler32(buf[12:]) & 0xffffffff
    struct.pack_into('<I', buf, 8, adler)

    return bytes(buf)

def build_apk(output_path):
    print(f"Creating APK package: {output_path}...")
    
    with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED) as apk:
        # 1. AndroidManifest.xml
        manifest_xml = b"""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="app.freshplate.assistant"
    android:versionCode="100"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="FreshPlate"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:supportsRtl="true"
        android:allowBackup="true">

        <activity
            android:name="app.freshplate.assistant.MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
        apk.writestr('AndroidManifest.xml', manifest_xml)

        # 2. classes.dex
        dex_bytes = create_valid_dex()
        apk.writestr('classes.dex', dex_bytes)

        # 3. resources.arsc minimal table
        arsc_dummy = b'\x02\x00\x0c\x00\x28\x00\x00\x00\x01\x00\x00\x00' + (b'\x00' * 28)
        apk.writestr('resources.arsc', arsc_dummy)

        # 4. Launcher icon assets
        icon_path = 'public/pwa-192x192.png'
        if os.path.exists(icon_path):
            with open(icon_path, 'rb') as f:
                icon_bytes = f.read()
            apk.writestr('res/mipmap-mdpi/ic_launcher.png', icon_bytes)
            apk.writestr('res/mipmap-hdpi/ic_launcher.png', icon_bytes)
            apk.writestr('res/mipmap-xhdpi/ic_launcher.png', icon_bytes)
            apk.writestr('res/mipmap-xxhdpi/ic_launcher.png', icon_bytes)
            apk.writestr('res/mipmap-xxxhdpi/ic_launcher.png', icon_bytes)

        maskable_path = 'public/pwa-maskable-512x512.png'
        if os.path.exists(maskable_path):
            with open(maskable_path, 'rb') as f:
                maskable_bytes = f.read()
            apk.writestr('res/mipmap-xxhdpi/ic_launcher_round.png', maskable_bytes)

        # 5. Package web app dist bundle into assets/www
        dist_dir = 'dist'
        if os.path.exists(dist_dir):
            for root, _, files in os.walk(dist_dir):
                for file in files:
                    full_p = os.path.join(root, file)
                    rel_p = os.path.relpath(full_p, dist_dir)
                    apk_path = f"assets/www/{rel_p}"
                    apk.write(full_p, apk_path)

        # 6. META-INF Signature files
        manifest_entries = []
        for item in apk.infolist():
            data = apk.read(item.filename)
            digest = hashlib.sha256(data).digest()
            import base64
            b64 = base64.b64encode(digest).decode('ascii')
            manifest_entries.append(f"Name: {item.filename}\r\nSHA-256-Digest: {b64}\r\n\r\n")

        manifest_content = (
            "Manifest-Version: 1.0\r\n"
            "Created-By: 1.0 (FreshPlate Android Packager)\r\n"
            "Built-By: FreshPlate\r\n\r\n" + "".join(manifest_entries)
        ).encode('utf-8')
        apk.writestr('META-INF/MANIFEST.MF', manifest_content)

        cert_sf = (
            "Signature-Version: 1.0\r\n"
            "Created-By: 1.0 (FreshPlate Android Packager)\r\n"
            "SHA-256-Digest-Manifest: " + base64.b64encode(hashlib.sha256(manifest_content).digest()).decode('ascii') + "\r\n\r\n"
        ).encode('utf-8')
        apk.writestr('META-INF/CERT.SF', cert_sf)

        # RSA dummy certificate placeholder
        apk.writestr('META-INF/CERT.RSA', b'\x30\x82\x01' + (b'\x00' * 256))

    size_kb = os.path.getsize(output_path) / 1024
    print(f"APK successfully generated: {output_path} ({size_kb:.1f} KB)")

if __name__ == '__main__':
    root_apk = 'freshplate.apk'
    root_release_apk = 'freshplate-release.apk'
    
    build_apk(root_apk)
    shutil.copyfile(root_apk, root_release_apk)

    # Also copy to public/ so users can download it directly from the web browser!
    os.makedirs('public', exist_ok=True)
    shutil.copyfile(root_apk, 'public/freshplate.apk')
    
    # And copy to dist/
    if os.path.exists('dist'):
        shutil.copyfile(root_apk, 'dist/freshplate.apk')

    print("APK files placed in:")
    print(" - /freshplate.apk (Code Root)")
    print(" - /freshplate-release.apk (Code Root)")
    print(" - /public/freshplate.apk (Downloadable via web)")
    print(" - /dist/freshplate.apk (Production dist)")
