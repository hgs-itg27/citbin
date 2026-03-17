"use client";

import { useEffect } from "react";

/**
 * Error boundary component for displaying a fallback UI when an error is caught.
 *
 * @param error - The error object that was thrown.
 * @param reset - A function to reset the error boundary and attempt to recover.
 *
 * This component logs the error to the console and provides a button for users
 * to retry rendering the affected segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
