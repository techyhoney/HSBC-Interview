"use client";

import { Button, ErrorBanner } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-12">
      <ErrorBanner
        message={
          error.message ||
          "Failed to load market data. Is the Java service running on port 8080?"
        }
      />
      <Button variant="secondary" onClick={reset} className="self-start">
        Try again
      </Button>
    </div>
  );
}
