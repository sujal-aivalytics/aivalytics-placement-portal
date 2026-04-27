"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Copy, Upload, CreditCard, Bell, Lock, User, Camera, Loader2, Save, CheckCircle, Smartphone, Mail, GraduationCap, AlertCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UserProfile {
  name: string;
  email: string;
  image: string | null;
  coverImage: string | null;
  phone: string;
  accountType: string;
  role: string;
  autoPayout: boolean;
  graduationCGPA: number | null;
  tenthPercentage: number | null;
  twelfthPercentage: number | null;
  notifications: {
    email: boolean;
    push: boolean;
    newsletter: boolean;
  };
}

export default function ProfilePage() {
  const { data: session, update } = useSession(); // Destructure update
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    image: null,
    coverImage: null,
    phone: '',
    accountType: 'Regular',
    role: 'user',
    autoPayout: false,
    graduationCGPA: null,
    tenthPercentage: null,
    twelfthPercentage: null,
    notifications: {
      email: true,
      push: true,
      newsletter: true,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const isIncomplete = searchParams.get('incomplete') === 'true';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUser({
          ...data,
          name: data.name || session?.user?.name || '',
          email: data.email || session?.user?.email || '',
          image: data.image || session?.user?.image || '',
          phone: data.phone || '',
          accountType: data.accountType || 'Regular',
          role: data.role || 'user',
          autoPayout: data.autoPayout || false,
          coverImage: data.coverImage || '/images/default-cover.png',
          graduationCGPA: data.graduationCGPA ?? null,
          tenthPercentage: data.tenthPercentage ?? null,
          twelfthPercentage: data.twelfthPercentage ?? null,
          notifications: data.notifications || { email: true, push: true, newsletter: true },
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    // Basic Validation
    if (!user.name || typeof user.name !== 'string' || user.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }

    if (!user.email || typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!user.phone || typeof user.phone !== 'string' || !/^\d{10}$/.test(user.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const validateNumber = (val: any, min: number, max: number, label: string) => {
      if (val === null || val === undefined) return true;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) {
        toast.error(`Invalid ${label}`);
        return false;
      }
      if (num < min || num > max) {
        toast.error(`${label} must be between ${min} and ${max}`);
        return false;
      }
      return true;
    };

    if (!validateNumber(user.graduationCGPA, 0, 10, "CGPA")) return;
    if (!validateNumber(user.tenthPercentage, 0, 100, "10th percentage")) return;
    if (!validateNumber(user.twelfthPercentage, 0, 100, "12th percentage")) return;

    if (user.role !== 'admin') {
      if (!user.phone || user.graduationCGPA === null || user.tenthPercentage === null || user.twelfthPercentage === null) {
        toast.error("Please fill in all required fields (Phone, Grades)!");
        return;
      }
    } else {
      if (!user.phone) {
        toast.error("Please fill in all required fields (Phone)!");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully");
        await update(); // Force session update to refresh profile completion status
        if (isIncomplete) {
          window.location.href = '/dashboard';
        }
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string;
          toast.error(firstError || data.message || "Failed update");
        } else {
          toast.error(data.message || "Failed update");
        }
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading("Uploading image...");

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, [field]: data.url }));
        toast.success("Image uploaded", { id: toastId });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-none p-8 border border-gray-100 shadow-sm space-y-6 aivalytics-card"
          >
            <div>
              <p className="text-primary text-[11px] font-bold uppercase tracking-wider mb-2">User Profile</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Personal Information</h3>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Manage your account details and contact information.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11 rounded-none border-gray-200 bg-white focus:bg-white transition-all font-medium text-gray-900 focus:ring-0 focus:border-primary"
                    placeholder="Enter full name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                  <Input
                    className="pl-10 h-11 rounded-none border-gray-200 bg-white focus:bg-white transition-all font-medium text-gray-900 focus:ring-0 focus:border-primary"
                    placeholder="example@edu.com"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Phone Number <span className="text-primary">*</span></label>
                <div className="relative group">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                  <Input
                    className={cn(
                      "pl-10 h-11 rounded-none border-gray-200 bg-white focus:bg-white transition-all font-medium text-gray-900 focus:ring-0 focus:border-primary",
                      (!user.phone && isIncomplete) ? 'border-primary ring-2 ring-primary/10' : ''
                    )}
                    placeholder="+91 9876543210"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Account Type</label>
                <Input className="h-11 rounded-none border-gray-200 bg-gray-50 font-medium text-gray-500 cursor-not-allowed" value={user.accountType} disabled />
              </div>
            </div>

            {user.role !== 'admin' && (
              <div className="pt-5 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-primary/10 rounded-none text-primary">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-primary font-bold uppercase tracking-wider">Academic Records</p>
                    <h3 className="text-base font-bold text-gray-900">Educational Performance</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Graduation CGPA <span className="text-primary">*</span></label>
                    <Input
                      type="number" step="0.01" max="10"
                      className={cn(
                        "h-11 rounded-none border-gray-200 bg-white focus:bg-white transition-all font-medium focus:ring-0 focus:border-primary",
                        (!user.graduationCGPA && isIncomplete) ? 'border-primary ring-2 ring-primary/10' : ''
                      )}
                      placeholder="8.5"
                      value={user.graduationCGPA ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUser({ ...user, graduationCGPA: val === '' ? null : parseFloat(val) });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-caption text-gray-500 font-semibold uppercase tracking-wide">12th Percentage <span className="text-primary">*</span></label>
                    <Input
                      type="number" step="0.01" max="100"
                      className={cn(
                        "h-12 rounded-none border-gray-200 bg-white focus:bg-white transition-all font-medium focus:ring-0 focus:border-primary",
                        (!user.twelfthPercentage && isIncomplete) ? 'border-primary ring-2 ring-primary/10' : ''
                      )}
                      placeholder="85.5"
                      value={user.twelfthPercentage ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUser({ ...user, twelfthPercentage: val === '' ? null : parseFloat(val) });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-caption text-gray-500 font-semibold uppercase tracking-wide">10th Percentage <span className="text-primary">*</span></label>
                    <Input
                      type="number" step="0.01" max="100"
                      className={cn(
                        "h-12 rounded-none border-gray-200 bg-white focus:bg-white transition-all font-medium focus:ring-0 focus:border-primary",
                        (!user.tenthPercentage && isIncomplete) ? 'border-primary ring-2 ring-primary/10' : ''
                      )}
                      placeholder="90.0"
                      value={user.tenthPercentage ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUser({ ...user, tenthPercentage: val === '' ? null : parseFloat(val) });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-3">Profile Picture</p>
              <div className="flex flex-col lg:flex-row items-center gap-5 p-5 border border-gray-200 rounded-none bg-gray-50 hover:bg-white hover:border-primary/30 transition-all group">
                <Avatar className="w-20 h-20 rounded-none border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                  <AvatarImage src={user.image || ''} />
                  <AvatarFallback className="bg-primary text-white text-xl font-bold">{user.name?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 w-full">
                  <div
                    className="flex flex-col items-center justify-center w-full h-28 bg-white rounded-none border border-gray-200 cursor-pointer hover:border-primary hover:shadow-md transition-all relative overflow-hidden group/upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-none flex items-center justify-center mb-2 group-hover/upload:scale-110 transition-transform relative z-10">
                      <Upload className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] text-gray-900 font-bold uppercase tracking-wider relative z-10">Upload New Photo</p>
                    <p className="text-[10px] text-gray-400 mt-1 relative z-10">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {user.role !== 'admin' && (
              <div className="pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between p-5 bg-primary/5 border border-primary/20 rounded-none">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Auto Payout</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Enable automatic payouts to your account</p>
                  </div>
                  <Switch
                    checked={user.autoPayout}
                    onCheckedChange={(checked) => setUser({ ...user, autoPayout: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            )}
          </motion.div>
        );
      case 'security':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-none p-8 border border-gray-100 shadow-sm space-y-6 aivalytics-card"
          >
            <div>
              <p className="text-red-500 text-[11px] font-bold uppercase tracking-wider mb-2">Security Settings</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Password & Security</h3>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Manage your password and security preferences.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Current Password</label>
                <Input type="password" className="h-11 rounded-none border-gray-200 bg-white font-medium focus:ring-0 focus:border-primary" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">New Password</label>
                <Input type="password" className="h-11 rounded-none border-gray-200 bg-white font-medium focus:ring-0 focus:border-primary" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Confirm New Password</label>
                <Input type="password" className="h-11 rounded-none border-gray-200 bg-white font-medium focus:ring-0 focus:border-primary" placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-5 border-t border-gray-100 flex justify-end">
              <Button className="h-11 px-6 rounded-none bg-red-600 text-white hover:bg-red-700 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" variant="destructive">
                Update Password
              </Button>
            </div>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-none p-8 border border-gray-100 shadow-sm space-y-6 aivalytics-card"
          >
            <div>
              <p className="text-primary text-[11px] font-bold uppercase tracking-wider mb-2">Notifications</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Communication Preferences</h3>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Manage how you receive notifications and updates.</p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Email Notifications', desc: 'Receive updates and announcements via email', icon: Mail },
                { title: 'Push Notifications', desc: 'Get instant alerts on your device', icon: Smartphone },
                { title: 'Newsletter', desc: 'Weekly digest of new content and features', icon: Bell }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-none border border-gray-200 hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-none flex items-center justify-center group-hover:scale-105 transition-all group-hover:bg-primary group-hover:text-white">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={user.notifications[item.title.toLowerCase().split(' ')[0] as keyof typeof user.notifications]} 
                    onCheckedChange={(checked) => {
                      const key = item.title.toLowerCase().split(' ')[0] as keyof typeof user.notifications;
                      setUser(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [key]: checked
                        }
                      }));
                    }}
                    className="data-[state=checked]:bg-primary" 
                  />
                </div>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fcfb]">
      <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-1000">

        {isIncomplete && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600 rounded-none p-5 shadow-sm border-l-4 border-l-red-600">
            <AlertCircle className="h-5 w-5" />
            <div className="ml-4">
              <AlertTitle className="text-[11px] font-bold uppercase tracking-wider">Profile Incomplete</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                Please complete all required fields to access the full platform.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Cover Image */}
        <div className="relative h-56 w-full rounded-none overflow-hidden group shadow-sm">
          <img
            src={user.coverImage || '/images/default-cover.png'}
            alt="Cover"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
            <Button
              variant="secondary"
              className="h-11 px-5 rounded-none text-[11px] font-bold uppercase tracking-wider bg-white text-gray-900 shadow-sm hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => coverInputRef.current?.click()}
            >
              <Camera className="w-4 h-4 mr-2" /> Change Cover
            </Button>
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'coverImage')}
            />
          </div>
        </div>

        <div className="px-6 relative -mt-16 z-10">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 w-full">
            <div className="relative group">
              <Avatar className="w-28 h-28 rounded-none border-4 border-white bg-white shadow-lg transition-all duration-300 group-hover:scale-105">
                <AvatarImage src={user.image || ''} className="transition-transform duration-300 group-hover:scale-110" />
                <AvatarFallback className="text-3xl font-bold bg-primary text-white">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <button
                className="absolute -bottom-1 -right-1 p-2.5 bg-gray-900 text-white rounded-none shadow-md hover:bg-primary transition-all duration-300 z-20 transform hover:-translate-y-0.5 group/btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'image')}
              />
            </div>

            <div className="flex-1 mb-3 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">{user.name}</h1>
                <Badge className="bg-primary text-white border-0 px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {user.role === 'admin' ? 'Admin' : 'Verified'}
                </Badge>
              </div>
              <p className="text-base text-gray-500 mt-2">{user.email}</p>
            </div>

            <div className="flex gap-3 mb-3">
              <Button
                className="h-11 px-6 rounded-none bg-gray-900 text-white hover:bg-black text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md border-b-2 border-primary flex items-center gap-2"
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8 px-6">

          {/* Left Settings Navigation */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white rounded-none p-2 border border-gray-100 shadow-sm">
              {[
                { id: 'personal', icon: User, label: 'Personal Info' },
                { id: 'security', icon: Lock, label: 'Security' },
                { id: 'notifications', icon: Bell, label: 'Notifications' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-none transition-all duration-300 text-[11px] font-bold uppercase tracking-wider group",
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-4 h-4 transition-transform duration-300 group-hover:scale-110", activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-primary')} />
                    {item.label}
                  </div>
                  {activeTab === item.id && <CheckCircle className="w-4 h-4 text-white/60" />}
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full justify-start gap-3 h-11 rounded-none text-gray-500 hover:bg-red-50 hover:text-red-600 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 group bg-white border border-gray-100 hover:border-red-200"
            >
              <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              Sign Out
            </Button>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
