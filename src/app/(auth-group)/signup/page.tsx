'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [userType, setUserType] = useState<string>("college");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);



  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          password,
          collegeName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success("Account created successfully!");
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto w-full space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">

      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs text-primary font-semibold uppercase tracking-wider">Enrollment</p>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Create <span className="text-primary italic">Account</span></h1>
        <p className="text-sm text-gray-500">Start your journey with AiValytics today.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Institutional Email <span className="text-primary">*</span></label>
            <div className="flex gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@university.edu"
                className="h-11 rounded-none border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-0 focus:border-primary font-medium text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="first-name" className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">First Name <span className="text-primary">*</span></label>
              <Input
                id="first-name"
                name="first"
                placeholder="First Name"
                className="h-11 rounded-none border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-0 focus:border-primary font-medium text-gray-900"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="last-name" className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Last Name</label>
              <Input
                id="last-name"
                name="last"
                placeholder="Last Name"
                className="h-11 rounded-none border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-0 focus:border-primary font-medium text-gray-900"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="mobile" className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Mobile Number <span className="text-primary">*</span></label>
            <div className="flex gap-2">
              <button 
                id="country-selector"
                aria-label="Select Country Code" 
                type="button" 
                className="h-11 px-3 border border-gray-200 rounded-none flex items-center gap-2 bg-gray-50 text-sm font-semibold text-gray-700 min-w-[80px]"
              >
                +91 <ChevronDown className="w-4 h-4 opacity-30 ml-auto" />
              </button>
              <Input
                id="mobile"
                name="phone"
                type="tel"
                placeholder="9876543210"
                className="h-11 rounded-none border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-0 focus:border-primary font-medium text-gray-900 flex-1"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="college" className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">
              {userType === 'school' ? 'School Name' : userType === 'professional' ? 'Current Organization' : 'University / College Name'} <span className="text-primary">*</span>
            </label>
            <Input
              id="college"
              name="college"
              placeholder={userType === 'school' ? "Enter school name" : userType === 'professional' ? "Enter company name" : "Enter university name"}
              className="h-11 rounded-none border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-0 focus:border-primary font-medium text-gray-900"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" title="password" className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Access Password <span className="text-primary">*</span></label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 rounded-none border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-0 focus:border-primary pr-12 font-medium text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* User Type Chips */}
          <div className="pt-2">
            <p id="category-label" className="text-[11px] text-gray-400 font-bold uppercase tracking-wide block mb-3">Select Category <span className="text-primary">*</span></p>
            <div role="radiogroup" aria-labelledby="category-label" className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['school', 'college', 'fresher', 'professional'].map((type) => (
                <button
                  id={`type-${type}`}
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={userType === type}
                  onClick={() => setUserType(type)}
                  className={`h-10 px-2 rounded-none text-[10px] font-bold uppercase tracking-wider border transition-all ${userType === type ? 'border-primary text-primary bg-primary/5 shadow-sm' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  {type === 'school' ? 'School' : type === 'college' ? 'University' : type === 'fresher' ? 'Graduate' : 'Professional'}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Checkbox id="terms" className="mt-0.5 rounded-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" required />
              <label htmlFor="terms" className="text-[11px] text-gray-500 font-medium leading-tight uppercase tracking-wide">
                I agree to the <Link href="/privacy-policy" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link> and <Link href="/terms-of-use" className="text-primary hover:underline underline-offset-2">Terms of Use</Link>
              </label>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="relative w-full h-12 rounded-none bg-gray-900 text-white hover:bg-black text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </Button>
          <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Already registered? <Link href="/login" className="text-primary hover:underline underline-offset-2 ml-1 transition-all">Portal Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
