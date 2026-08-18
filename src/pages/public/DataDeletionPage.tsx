import { LegalLayout, LegalH2 } from '@/components/public/LegalLayout';

export function DataDeletionPage() {
  return (
    <LegalLayout
      title="Data Deletion"
      description="How to request deletion of your FORVA PropTech account and data."
      lastUpdated="August 2026"
    >
      <p>
        You can request deletion of your FORVA PropTech account and associated personal data at
        any time. This page explains what is deleted and how to submit a request.
      </p>

      <LegalH2>What You Can Request</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Deletion of your account profile and business information.</li>
        <li>Deletion of lead contact data you have captured through the platform.</li>
        <li>Removal of activity logs and communication records associated with your account.</li>
      </ul>

      <LegalH2>How to Submit a Request</LegalH2>
      <p>To request data deletion, please use one of the following methods:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Email: Send a request from your account email to hello@forva.net with the subject "Data Deletion Request".</li>
        <li>In-app: Navigate to Settings → Security and use the account deletion option.</li>
      </ul>
      <p>
        Please include your name and the email address associated with your account so we can
        verify your identity before processing.
      </p>

      <LegalH2>Processing Time</LegalH2>
      <p>
        We aim to process verified deletion requests within 30 days. You will receive a
        confirmation email once your data has been removed.
      </p>

      <LegalH2>What May Be Retained</LegalH2>
      <p>
        Certain records may be retained where required by law or for legitimate business purposes,
        such as fraud prevention or financial record-keeping obligations.
      </p>

      <LegalH2>Contact</LegalH2>
      <p>For questions about data deletion, contact hello@forva.net.</p>
    </LegalLayout>
  );
}
