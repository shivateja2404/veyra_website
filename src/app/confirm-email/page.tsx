'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ConfirmEmailPage() {
  const [showConfetti, setShowConfetti] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setAccessToken(params.get('access_token'));
    }, []);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!accessToken) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <p className="text-red-500 text-lg">
        Invalid or expired link. 
      </p>
    </div>
  );
} 


  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 bg-white shadow-xl rounded-3xl text-center space-y-6"
      >
        <motion.img
          src="/logo.svg.png"
          alt="App Logo"
          className="w-20 h-20 mx-auto rounded-full"
          initial={{ rotate: -15 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.h1
          className="text-2xl md:text-3xl font-extrabold text-blue-500"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
           Veyra
        </motion.h1>
        <motion.h1
          className="text-2xl md:text-3xl font-extrabold text-green-500"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          ✅ Email Confirmed 
        </motion.h1>

        <motion.p
          className="text-gray-600 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Your email has been successfully verified 
        </motion.p>

        <motion.p
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg"
        >
          You can login in the app now
        </motion.p>

        {showConfetti && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Confetti effect can be implemented using canvas or a library like react-confetti */}
          </div>
        )}
      </motion.div>
    </div>
  );
}
