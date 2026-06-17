'use client';

import ErrorCard from '@/components/errorCard';

export default function Error({
	reset,
}: {
	reset: () => void;
}) {
  return <ErrorCard reset={reset} />;
}