import { Link } from 'react-router-dom';

export function Logo({
  variant = 'full',
  className = '',
}: {
  variant?: 'full' | 'mark';
  className?: string;
}) {
  if (variant === 'mark') {
    return (
      <img
        src="/FORVA.png"
        alt="FORVA PropTech"
        className={`h-11 w-auto object-contain ${className}`}
      />
    );
  }
  return (
    <Link
      to="/"
      className={`flex items-center ${className}`}
      aria-label="FORVA PropTech home"
    >
      <img
        src="/FORVA.png"
        alt="FORVA PropTech"
        className="h-11 w-auto object-contain"
      />
    </Link>
  );
}
