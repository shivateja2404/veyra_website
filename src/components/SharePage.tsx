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

  console.log('[SharePage Client] Component loaded:', {
    contentType,
    contentId,
    title,
    referralId,
    appUrl
  });

  useEffect(() => {
    let appOpened = false;
    let detectionTimer: NodeJS.Timeout;

    // Check for referral parameter and store in sessionStorage
    if (referralId) {
      console.log('[SharePage Client] Storing referral ID:', referralId);
      sessionStorage.setItem('veyra_ref', referralId);
      // Store in cookie for 30 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `veyra_ref=${referralId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      console.log('[SharePage Client] Referral ID stored in sessionStorage and cookie');
    }

    const openApp = () => {
      console.log('[SharePage Client] Attempting to open app:', appUrl);

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
          console.log('[SharePage Client] Cleanup: iframe removed');
        }
      }, 1000);
    };

    const setupDetection = () => {
      // Detect if app opened (page becomes hidden)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          console.log('[SharePage Client] Page hidden - App likely opened');
          appOpened = true;
          clearTimeout(detectionTimer);
        }
      });

      // Detect if app opened (page loses focus)
      window.addEventListener('blur', () => {
        console.log('[SharePage Client] Page lost focus - App likely opened');
        appOpened = true;
        clearTimeout(detectionTimer);
      });

      // Timeout: show fallback if app didn't open
      detectionTimer = setTimeout(() => {
        if (!appOpened) {
          console.log('[SharePage Client] App did not open - Showing fallback UI');
          setShowFallback(true);
        } else {
          console.log('[SharePage Client] App opened successfully');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-6 sm:p-8 text-white text-center font-sans">
      <div className="max-w-sm sm:max-w-md w-full animate-fadeIn">
        <div className="flex justify-center mb-6 sm:mb-8">
          <img
            src="/logo.svg.png"
            alt="Veyra"
            className="h-16 sm:h-20 w-auto drop-shadow-2xl"
          />
        </div>

        {!showFallback ? (
          <div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6 sm:mb-8"></div>
            <div className="text-xl sm:text-2xl mb-3 sm:mb-4 font-medium">Opening in app...</div>
            <div className="text-base sm:text-lg opacity-90">Please wait a moment</div>
          </div>
        ) : (
          <div>
            <div className="text-xl sm:text-2xl mb-5 sm:mb-6 font-medium px-4">Don&apos;t have the Veyra app?</div>
            <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8 px-4 sm:px-0">
              <a
                href={appUrl}
                className="group inline-flex items-center justify-center gap-3 px-8 py-3 sm:py-4 bg-white hover:bg-gray-100 text-purple-600 rounded-full font-semibold text-base sm:text-lg shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 w-fit mx-auto"
              >
                Open in App
              </a>
              <a
                href={process.env.NEXT_PUBLIC_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/GetItOnGooglePlay_Badge_Web_color_English.svg"
                  alt="Get it on Google Play"
                  className="h-[52px] sm:h-[60px] w-auto"
                />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                  alt="Download on the App Store"
                  className="h-[52px] sm:h-[60px] w-auto"
                />
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 sm:mt-12 opacity-70 text-xs sm:text-sm">
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
