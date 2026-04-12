import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { Shield, Lock, EyeOff, Server, HardDrive } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    { icon: <Shield />, title: "Data Encryption", desc: "All data is encrypted at rest and in transit using industry-standard AES-256." },
    { icon: <Lock />, title: "Safe Authentication", desc: "Multi-factor authentication and secure token management for all student accounts." },
    { icon: <EyeOff />, title: "Privacy First", desc: "Your mock interview sessions and results are private and only accessible by you." },
    { icon: <Server />, title: "Secure Infrastructure", desc: "Hosted on enterprise-grade cloud providers with 99.9% uptime and DDoS protection." },
  ];

  return (
    <LegalPageLayout title="Security at AiValytics" lastUpdated="April 12, 2026">
      <p>
        Trust is the foundation of the AiValytics experience. We understand the sensitivity of your career 
        data and performance metrics, and we treat your information with the highest level of security.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mt-12">
        {securityFeatures.map((item, i) => (
          <div key={i} className="flex gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-[#00B4A0]/20 transition-all">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#00B4A0] group-hover:bg-[#00B4A0] group-hover:text-white transition-all shadow-sm">
              {item.icon}
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-[#1A1A2E]">{item.title}</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-16">Reporting Vulnerabilities</h2>
      <p>
        We take security seriously and welcome the community to help us maintain it. If you believe 
        you've found a security vulnerability on AiValytics, please contact us at security@aivalytics.ai.
        We provide a Bug Bounty program for qualified reports.
      </p>
    </LegalPageLayout>
  );
}
