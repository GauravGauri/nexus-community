"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, ArrowLeft, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold tracking-tight text-white">Reset your Password</h2>
        <p className="text-xs text-zinc-400">
          {step === 1
            ? "Enter your verified organization email address"
            : step === 2
            ? "Verify code sent to your email inbox"
            : "Reset successfully completed"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="email-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleEmailSubmit}
            className="space-y-4"
          >
            <Input
              label="Organization Email"
              type="email"
              placeholder="e.g. yourname@nexus.edu"
              leftIcon={<Mail className="h-4.5 w-4.5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button variant="primary" className="w-full" type="submit" loading={loading}>
              Send Reset Code
            </Button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="otp-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleOtpSubmit}
            className="space-y-4"
          >
            <Input
              label="6-Digit Reset Code"
              placeholder="123456"
              maxLength={6}
              leftIcon={<ShieldAlert className="h-4.5 w-4.5" />}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              error={error}
              required
            />
            <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
              For evaluation, you can enter any 6 digits (e.g. <b>123456</b>) to confirm code verification.
            </p>
            <Button variant="primary" className="w-full" type="submit" loading={loading}>
              Verify Code
            </Button>
            <Button
              variant="ghost"
              className="w-full text-zinc-400 hover:text-white"
              onClick={() => setStep(1)}
              type="button"
            >
              Back
            </Button>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 text-center py-4"
          >
            <div className="flex justify-center text-emerald-400">
              <CheckCircle2 className="h-12 w-12 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Password Restored</h3>
              <p className="text-xs text-zinc-400">
                Your credentials have been securely refreshed. You can now log back in.
              </p>
            </div>
            <Link href="/login" className="block w-full">
              <Button variant="primary" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {step !== 3 && (
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-xs text-zinc-400 hover:text-white font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Return to Login
          </Link>
        </div>
      )}
    </div>
  );
}
