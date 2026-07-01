"use client";

import { Button, ErrorBanner } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-12">
      <ErrorBanner message={error.message || "Something went wrong."} />
      <Button variant="secondary" onClick={reset} className="self-start">
        Try again
      </Button>
    </div>
  );
}
