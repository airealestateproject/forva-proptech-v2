import { useEffect } from 'react';

const BASE_TITLE = 'FORVA PropTech';
const DEFAULT_DESCRIPTION =
  'AI-powered real estate lead engine. Capture, qualify, book, notify, and grow.';

export function useDocumentTitle(title?: string, description?: string, noindex?: boolean) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE}: AI-Powered Real Estate Lead Engine`;

    const desc = description || DEFAULT_DESCRIPTION;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, noindex]);
}
