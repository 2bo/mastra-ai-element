import { Loader } from '@/components/ai-elements/loader';

/**
 * Loading component displayed during page transitions
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
