import { LegalLayout, LegalH2 } from '@/components/public/LegalLayout';

export function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="The terms that govern your use of FORVA PropTech."
      lastUpdated="August 2026"
    >
      <p>
        These Terms of Service govern your use of the FORVA PropTech website and application at
        proptech.forva.net. By using the service, you agree to these terms.
      </p>

      <LegalH2>Eligibility</LegalH2>
      <p>
        You must be at least 18 years old and authorized to act on behalf of yourself or your
        business to create an account.
      </p>

      <LegalH2>Acceptable Use</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>You are responsible for the accuracy of lead information you capture.</li>
        <li>You must comply with applicable marketing and communication laws when contacting leads.</li>
        <li>You may not use the service to send unsolicited or deceptive communications.</li>
      </ul>

      <LegalH2>Accounts</LegalH2>
      <p>
        You are responsible for maintaining the security of your account credentials. Agency
        owners are responsible for managing access for their team members.
      </p>

      <LegalH2>Service Availability</LegalH2>
      <p>
        We strive to maintain reliable service but do not guarantee uninterrupted access. Features
        may change over time as we improve the platform.
      </p>

      <LegalH2>Contact</LegalH2>
      <p>For questions about these terms, contact hello@forva.net.</p>
    </LegalLayout>
  );
}
