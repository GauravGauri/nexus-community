"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Key, User as UserIcon, Tag, ArrowRight, ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";

const AVAILABLE_INTERESTS = [
  "Coding",
  "UI/UX Design",
  "Artificial Intelligence",
  "Esports & Gaming",
  "Hardware & Robotics",
  "Music & Arts",
  "Finance & Startups",
  "Sports & Outdoors",
];

export default function SignupPage() {
  const router = useRouter();
  const login = useStore((state) => state.login);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleComplete = () => {
    setLoading(true);
    // Simulate user creation and auto-login
    setTimeout(() => {
      setLoading(false);
      // Log in as standard user "leosterling" for preview purposes
      login("leosterling");
      router.push("/verify-org"); // Prompt user to verify organization immediately after signup
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold tracking-tight text-white">Create your Account</h2>
        <p className="text-xs text-zinc-400">
          {step === 1 ? "Step 1 of 2: Profile credentials" : "Step 2 of 2: Select your interests"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleNext}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              placeholder="e.g. Leo Sterling"
              leftIcon={<UserIcon className="h-4.5 w-4.5" />}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Username"
              placeholder="e.g. leosterling"
              leftIcon={<UserIcon className="h-4.5 w-4.5" />}
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              error={errors.username}
              required
            />

            <Input
              label="Campus/Corporate Email"
              type="email"
              placeholder="e.g. leo@nexus.edu"
              leftIcon={<Mail className="h-4.5 w-4.5" />}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Key className="h-4.5 w-4.5" />}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              required
            />

            <Button variant="primary" className="w-full flex items-center justify-center gap-1.5" type="submit">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <p className="text-xs text-zinc-300 text-center leading-relaxed">
              Help us personalize your workspace feeds. Pick 3 or more topics to get matching community recommendations!
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {AVAILABLE_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <motion.button
                    key={interest}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/25"
                        : "border-white/5 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {interest}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-white/5 bg-white/[0.01] hover:bg-white/5 hover:text-white"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button
                variant="primary"
                className="flex-2 hover:shadow-lg"
                onClick={handleComplete}
                loading={loading}
                disabled={selectedInterests.length < 2}
              >
                {selectedInterests.length >= 2 ? "Complete Registration" : "Select at least 2"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-xs text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
}
