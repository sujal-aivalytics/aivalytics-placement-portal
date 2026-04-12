import { LegalPageLayout } from "@/components/landing/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="April 12, 2026">
      <h2>1. Information Collection</h2>
      <p>
        We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form.
      </p>
      
      <h2>2. Use of Information</h2>
      <p>
        Any of the information we collect from you may be used in one of the following ways: to personalize your experience, to improve our website, to improve customer service, or to process transactions.
      </p>

      <h2>3. Data Protection</h2>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
      </p>
      
      <h2>4. Disclosure to Outsiders</h2>
      <p>
        We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you.
      </p>
    </LegalPageLayout>
  );
}
