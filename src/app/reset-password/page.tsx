'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react'; // Install lucide-react: npm i lucide-react

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAccessToken(params.get('access_token'));
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };
  if (!accessToken) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <p className="text-red-500 text-lg">
        Invalid or expired link. Please request a new password reset email.
      </p>
    </div>
  );
}

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl text-center space-y-6"
        >
          <motion.img
            src="/logo.svg.png"
            alt="App Logo"
            className="w-24 h-24 mx-auto rounded-full object-contain"
            initial={{ rotate: -15 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-green-500"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            ✅ Password Updated
          </motion.h1>
          <motion.p
            className="text-gray-600 text-sm md:text-base"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Your password has been updated successfully. You can now login with your new password!
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <motion.form
        onSubmit={handleReset}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white space-y-6 text-center relative"
      >
        <motion.img
          src="/logo.svg.png"
          alt="App Logo"
          className="w-24 h-24 mx-auto rounded-full object-contain"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.h1
  className="text-black text-2xl md:text-3xl font-bold"
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
>
  Reset Password
</motion.h1>


        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            className="w-full p-3 border rounded-md text-sm md:text-base bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm New Password"
            className="w-full p-3 border rounded-md text-sm md:text-base bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-3 rounded-full text-sm md:text-base font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Set New Password'}
        </button>

        {errorMsg && (
          <motion.p
            className="text-sm text-red-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errorMsg}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
}
