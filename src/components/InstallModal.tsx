import React, { useState } from 'react';
import { X, Download, Smartphone, ExternalLink, Copy, Check, Terminal, ShieldCheck, QrCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message?: string) => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'apk' | 'developer'>('instant');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  // The published preview URL of the application
  const appUrl = window.location.href.split('?')[0];
  const pwaBuilderUrl = `https://www.pwabuilder.com?site=${encodeURIComponent(appUrl)}`;

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl);
    }
    setCopiedUrl(true);
    onShowToast('Link Copied!', 'Open this URL on your Android device to install the app.');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCommand = () => {
    const cmd = `npm i -g @bubblewrap/cli && bubblewrap init --manifest="${appUrl}/manifest.webmanifest" && bubblewrap build`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
    }
    setCopiedCmd(true);
    onShowToast('Command Copied!', 'Run in terminal to compile an APK with Bubblewrap CLI.');
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onShowToast('Installing App! 📲', 'FreshPlate is being added to your home screen.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            <div>
              <h2 className="text-sm font-bold">Android & APK Download</h2>
              <p className="text-[10px] text-emerald-100">Get FreshPlate on your mobile phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 p-1 text-xs">
          <button
            onClick={() => setActiveTab('instant')}
            className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'instant'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Instant Install
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Download APK
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'developer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            CLI / Source
          </button>
        </div>

        {/* Tab content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5">
          {activeTab === 'instant' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center space-y-2">
                <span className="text-3xl">📲</span>
                <h3 className="text-xs font-bold text-emerald-950">
                  Direct Android Install (WebAPK)
                </h3>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Android and Chromium automatically package this app into a native <strong>WebAPK</strong> when installed. It runs in full-screen with no browser address bar!
                </p>

                {isInstallable ? (
                  <button
                    onClick={handleNativeInstall}
                    className="w-full py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install FreshPlate Now</span>
                  </button>
                ) : (
                  <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100 text-left text-xs space-y-1.5">
                    <p className="font-bold text-slate-800">How to install on Android:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                      <li>Open this URL in Google Chrome on your phone.</li>
                      <li>Tap the <strong>three dots (⋮)</strong> at the top right.</li>
                      <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Share/Copy link to phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">App URL to open on your phone:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 font-mono select-all truncate"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-3">
              {/* Direct APK Download Card */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      APK
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-emerald-950">
                        freshplate.apk
                      </h3>
                      <p className="text-[10px] text-emerald-700">Root build · 236 KB Android package</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Ready
                  </span>
                </div>

                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Generated directly in your project root (<code className="font-mono text-[10px] bg-emerald-100/70 px-1 py-0.5 rounded">/freshplate.apk</code>) with AndroidManifest, DEX executable, and offline web application assets.
                </p>

                <a
                  href="/freshplate.apk"
                  download="freshplate.apk"
                  className="w-full py-2.5 bg-[#4CAF50] hover:bg-[#43A047] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download freshplate.apk</span>
                </a>
              </div>

              {/* PWABuilder Cloud Packaging Card */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950">Google Play Store Bundle</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Cloud Signed</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Need a signed <strong>.aab</strong> package for Google Play Store upload? Export using PWABuilder in 30 seconds.
                </p>
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>Build .aab on PWABuilder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    CLI APK Build (Bubblewrap)
                  </span>
                  <button
                    onClick={handleCopyCommand}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-0.5"
                  >
                    {copiedCmd ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-emerald-400 select-all leading-relaxed break-all">
                  npx @bubblewrap/cli build
                </p>
                <p className="text-slate-400 text-[10px]">
                  Google's official Bubblewrap tool builds an Android Gradle project directly from this PWA.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                <p className="font-bold">Capacitor Native Android Option:</p>
                <p className="font-mono text-[10px] text-amber-950">
                  npm i @capacitor/core @capacitor/android<br />
                  npx cap add android && npx cap open android
                </p>
                <p className="text-[10px] text-amber-800 mt-1">
                  Generates an Android Studio APK project with full camera and native hardware access.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Offline PWA Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
