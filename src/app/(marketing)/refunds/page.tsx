import { LegalPageLayout } from "@/components/landing/LegalPageLayout";

export default function RefundsPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="April 12, 2026">
      <h2>1. General Refund Policy</h2>
      <p>
        At AiValytics, we strive to ensure our students have the best possible experience. If you are not entirely satisfied with your purchase, we're here to help.
      </p>
      
      <h2>2. Eligibility for Refunds</h2>
      <p>
        You have 7 calendar days to request a refund for a course or certificate program from the date you purchased it. To be eligible for a refund, you must have completed less than 20% of the course content.
      </p>

      <h2>3. Non-refundable Purchases</h2>
      <p>
        Certain services are non-refundable, including but not limited to: one-on-one mentorship sessions already conducted, and premium interview simulation slots that were missed without prior notice.
      </p>

      <h2>4. Processing Refunds</h2>
      <p>
        Once we receive your refund request, we will inspect it and notify you that we have received your request. We will immediately notify you on the status of your refund after inspecting the request.
      </p>
    </LegalPageLayout>
  );
}
