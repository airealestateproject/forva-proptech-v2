import { useDocumentTitle } from '@/hooks/useDocumentTitle';

interface Props {
  title: string;
  description?: string;
  noindex?: boolean;
}

export function Seo({ title, description, noindex }: Props) {
  useDocumentTitle(title, description, noindex);
  return null;
}
