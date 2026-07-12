"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ShieldCheck, UploadCloud, Ticket, MailCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyOrgPage() {
  const router = useRouter();
  const { currentUser, verifyOrg } = useStore();
  const [method, setMethod] = useState<"id_card" | "invite_code" | "email_otp" | null>(null);
  
  // Method States
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  
  // File upload simulation states
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleIdUploadSubmit = () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        verifyOrg({
          type: "id_card",
          value: file.name,
          fileUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=300",
        });
        setSuccess(true);
      }
    }, 300);
  };

  const handleInviteCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) return;
    
    if (inviteCode.trim() === "NEXUS-2026") {
      verifyOrg({ type: "invite_code", value: inviteCode });
      setSuccess(true);
      setError("");
    } else {
      setError("Invalid code. Try entering 'NEXUS-2026' for testing.");
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid academic/corporate email");
      return;
    }
    setEmailSent(true);
    setError("");
  };

  const handleVerifyEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError("Code must be 6 digits");
      return;
    }
    verifyOrg({ type: "email_otp", value: email });
    setSuccess(true);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <ShieldCheck className="h-6 w-6 text-violet-400" />
          Verify Organization
        </h2>
        <p className="text-xs text-zinc-400">
          Verify your student or employee status to join private spaces.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="verified-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5 text-center py-4"
          >
            <div className="flex justify-center text-emerald-400">
              <CheckCircle2 className="h-14 w-14 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Verification Completed!</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Congratulations! You are now a verified member of <b>{currentUser?.org?.name || "Nexus Campus"}</b>.
                Your profile now displays the shield badge.
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-1.5"
              onClick={() => router.push("/dashboard")}
            >
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : method === null ? (
          <motion.div
            key="method-select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <button
              onClick={() => setMethod("invite_code")}
              className="w-full p-4 flex items-center space-x-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-left transition-all"
            >
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Invite Code</p>
                <p className="text-[10px] text-zinc-400">Enter a code provided by your organization administrator</p>
              </div>
            </button>

            <button
              onClick={() => setMethod("email_otp")}
              className="w-full p-4 flex items-center space-x-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-left transition-all"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <MailCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Organization Email</p>
                <p className="text-[10px] text-zinc-400">Enter your university or company email for an verification code</p>
              </div>
            </button>

            <button
              onClick={() => setMethod("id_card")}
              className="w-full p-4 flex items-center space-x-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-left transition-all"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">ID Card Upload</p>
                <p className="text-[10px] text-zinc-400">Upload a scan of your college, institute, or corporate ID card</p>
              </div>
            </button>

            <Button
              variant="ghost"
              className="w-full text-zinc-400 hover:text-white"
              onClick={() => router.push("/dashboard")}
            >
              Skip for Now
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="method-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* BACK BUTTON */}
            <Button
              variant="ghost"
              size="sm"
              className="!p-0 text-zinc-400 hover:text-white border-0"
              onClick={() => {
                setMethod(null);
                setError("");
              }}
            >
              ← Back to verification choices
            </Button>

            {/* METHOD 1: INVITE CODE */}
            {method === "invite_code" && (
              <form onSubmit={handleInviteCodeSubmit} className="space-y-4">
                <Input
                  label="Invite Code"
                  placeholder="e.g. NEXUS-2026"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  error={error}
                  required
                />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Tip: Enter <b>NEXUS-2026</b> to test immediate invite code validation.
                </p>
                <Button variant="primary" className="w-full" type="submit">
                  Verify Code
                </Button>
              </form>
            )}

            {/* METHOD 2: EMAIL OTP */}
            {method === "email_otp" && (
              <div className="space-y-4">
                {!emailSent ? (
                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <Input
                      label="Academic/Work Email"
                      placeholder="you@nexus.edu or you@vercel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={error}
                      required
                    />
                    <Button variant="primary" className="w-full" type="submit">
                      Send Verification Email
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                    <Input
                      label="6-Digit OTP Code"
                      placeholder="123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      error={error}
                      required
                    />
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Verification code sent to <b>{email}</b>. For evaluation, enter any 6 digits to verify.
                    </p>
                    <Button variant="primary" className="w-full" type="submit">
                      Verify Code
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* METHOD 3: ID CARD UPLOAD */}
            {method === "id_card" && (
              <div className="space-y-4">
                <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-6 text-center hover:bg-white/[0.03] transition-colors relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <UploadCloud className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">
                    {file ? file.name : "Drag & drop ID card scan"}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Supports PNG, JPG, or PDF up to 5MB</p>
                </div>

                {uploading && (
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}

                {error && <p className="text-xs text-destructive font-semibold">{error}</p>}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleIdUploadSubmit}
                  loading={uploading}
                >
                  Submit for Approval
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
