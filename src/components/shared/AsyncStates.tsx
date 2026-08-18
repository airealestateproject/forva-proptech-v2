import { AlertCircle, Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-silver-400">
      <Loader2 size={20} className="animate-spin text-accent-300" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-16 text-center">
      <AlertCircle size={28} className="text-red-300" />
      <p className="text-sm text-silver-300">Something went wrong loading this data.</p>
      <p className="text-xs text-silver-500">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-2 text-xs">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, message }: { icon: typeof AlertCircle; message: string }) {
  return (
    <div className="card py-16 text-center">
      <Icon size={32} className="mx-auto text-silver-600" />
      <p className="mt-3 text-sm text-silver-400">{message}</p>
    </div>
  );
}
