// components/SharePage.tsx - Smart redirect component for app deep linking

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SharePageProps {
  contentType: string;
  contentId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  referralId?: string;
}

export default function SharePage({
  contentType,
  contentId,
  title,
  description,
  imageUrl,
  referralId,
}: SharePageProps) {
  const router = useRouter();
  const [showFallback, setShowFallback] = useState(false);

  const APP_SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME || 'veyraapp://';
  const appUrl = referralId
    ? `${APP_SCHEME}${contentType}/${contentId}?ref=${referralId}`
    : `${APP_SCHEME}${contentType}/${contentId}`;

  useEffect(() => {
    let appOpened = false;
    let detectionTimer: NodeJS.Timeout;

    // Check for referral parameter and store in sessionStorage
    if (referralId) {
      sessionStorage.setItem('veyra_ref', referralId);
      // Store in cookie for 30 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `veyra_ref=${referralId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }

    const openApp = () => {
      console.log('Attempting to open app:', appUrl);

      // Method 1: Direct redirect
      window.location.href = appUrl;

      // Method 2: Iframe (iOS fallback)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appUrl;
      document.body.appendChild(iframe);

      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    };

    const setupDetection = () => {
      // Detect if app opened (page becomes hidden)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          appOpened = true;
          clearTimeout(detectionTimer);
        }
      });

      // Detect if app opened (page loses focus)
      window.addEventListener('blur', () => {
        appOpened = true;
        clearTimeout(detectionTimer);
      });

      // Timeout: show fallback if app didn't open
      detectionTimer = setTimeout(() => {
        if (!appOpened) {
          setShowFallback(true);
        }
      }, 2500);
    };

    setupDetection();
    setTimeout(openApp, 100);

    return () => {
      clearTimeout(detectionTimer);
    };
  }, [appUrl, referralId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 text-white text-center font-sans">
      <div className="max-w-md w-full animate-fadeIn">
        <div className="text-6xl font-extrabold mb-5 tracking-tight drop-shadow-lg">
          Veyra
        </div>

        {!showFallback ? (
          <div>
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-8"></div>
            <div className="text-2xl mb-4 font-medium">Opening in app...</div>
            <div className="text-lg opacity-90">Please wait a moment</div>
          </div>
        ) : (
          <div>
            <div className="text-2xl mb-4 font-medium">Don&apos;t have the Veyra app?</div>
            <div className="flex flex-col gap-4 mt-8">
              <a
                href={appUrl}
                className="inline-flex items-center justify-center px-10 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 shadow-xl"
              >
                📱 Open in Veyra App
              </a>
              <a
                href={process.env.NEXT_PUBLIC_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 bg-white/20 text-white rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 backdrop-blur-lg shadow-lg"
              >
                📥 Download for Android
              </a>
              <a
                href={process.env.NEXT_PUBLIC_APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 bg-white/20 text-white rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 backdrop-blur-lg shadow-lg"
              >
                🍎 Download for iOS
              </a>
            </div>
          </div>
        )}

        <div className="mt-12 opacity-70 text-sm">
          © 2025 Veyra - Fashion &amp; Style
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
