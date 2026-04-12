import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { Mail, MessageSquare, Phone, Clock } from "lucide-react";

export default function SupportPage() {
  const supportChannels = [
    { icon: <Mail />, title: "Email Support", value: "support@aivalytics.ai", desc: "For general inquiries and billing." },
    { icon: <MessageSquare />, title: "Live Chat", value: "Average response: 2m", desc: "Available 24/7 for premium members." },
    { icon: <Phone />, title: "Phone", value: "+1 (555) 000-0000", desc: "Mon-Fri, 9am - 6pm EST." },
    { icon: <Clock />, title: "Response Time", value: "< 24 Hours", desc: "Our commitment to all students." },
  ];

  return (
    <LegalPageLayout title="Customer Support" lastUpdated="April 12, 2026">
      <p>
        At AiValytics, we're dedicated to your success. Whether you're facing technical issues, 
        have questions about our courses, or need help with your career path, our team is here for you.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-12">
        {supportChannels.map((channel, i) => (
          <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-[#00B4A0]/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#00B4A0]/10 flex items-center justify-center text-[#00B4A0] mb-6 group-hover:bg-[#00B4A0] group-hover:text-white transition-all">
              {channel.icon}
            </div>
            <h4 className="text-lg font-black text-[#1A1A2E] mb-1">{channel.title}</h4>
            <p className="text-[#00B4A0] font-bold text-sm mb-2">{channel.value}</p>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">{channel.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16">Global Status</h2>
      <p>
        Currently, all AiValytics systems are operational. If you're experiencing issues with a 
        specific mock test or our AI engine, please check our server status page or contact us directly.
      </p>
    </LegalPageLayout>
  );
}
