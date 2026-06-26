'use client';

import ErrorCard from '@/components/custom/errorCard';

export default function Error({
	reset,
}: {
	reset: () => void;
}) {
  return <ErrorCard reset={reset} />;
}