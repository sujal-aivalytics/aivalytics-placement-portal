import { LegalPageLayout } from "@/components/landing/LegalPageLayout";

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="April 12, 2026">
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
      </p>
      
      <h2>2. How AiValytics Uses Cookies</h2>
      <p>
        When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences, and to enable advertisements delivery.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>
        In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
      </p>
    </LegalPageLayout>
  );
}
