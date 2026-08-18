import { LegalLayout, LegalH2 } from '@/components/public/LegalLayout';

export function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How FORVA PropTech collects, uses, and protects your data."
      lastUpdated="August 2026"
    >
      <p>
        FORVA PropTech ("we", "us") is a real estate lead management platform. This Privacy Policy
        explains how we collect, use, and protect information when you use our website and
        application at proptech.forva.net.
      </p>

      <LegalH2>Information We Collect</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Account information: name, email, phone, and business details you provide at sign-up.</li>
        <li>Lead information: contact details and qualification data for leads you capture.</li>
        <li>Usage data: how you interact with the platform, including activity logs.</li>
        <li>Integration data: information received from connected services such as lead ad platforms, email, and calendar tools.</li>
      </ul>

      <LegalH2>How We Use Your Information</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>To provide and maintain the FORVA PropTech service.</li>
        <li>To qualify and manage leads captured through your connected channels.</li>
        <li>To notify you of lead activity, appointments, and follow-ups.</li>
        <li>To improve our features and platform performance.</li>
      </ul>

      <LegalH2>Data Sharing</LegalH2>
      <p>
        We do not sell your data. We may share information with service providers who help us
        operate the platform (such as hosting, email, and SMS providers) under appropriate
        data-processing agreements.
      </p>

      <LegalH2>Your Rights</LegalH2>
      <p>
        You may request access to, correction of, or deletion of your personal data. See our
        Data Deletion page for instructions on how to submit a deletion request.
      </p>

      <LegalH2>Contact</LegalH2>
      <p>For privacy questions, contact hello@forva.net.</p>
    </LegalLayout>
  );
}
