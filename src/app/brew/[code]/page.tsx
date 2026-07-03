'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decodeBrew, type BrewData } from '@/utils/brewCodec';
import AlchemyLab from '@/components/AlchemyLab';

export default function BrewPage() {
  const params = useParams();
  const [sharedBrew, setSharedBrew] = useState<BrewData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const code = params.code as string;
    if (!code) {
      setFailed(true);
      return;
    }

    const brew = decodeBrew(code);
    if (!brew) {
      setFailed(true);
      return;
    }

    setSharedBrew(brew);
  }, [params.code]);

  if (failed) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#1e1e1e] text-gray-300">
        <p className="text-lg">Invalid or corrupted brew link.</p>
        <a href="/" className="text-yellow-400 underline hover:text-yellow-200">
          Go to alchemy lab
        </a>
      </div>
    );
  }

  if (!sharedBrew) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e1e1e]">
        <p className="text-lg text-gray-400">Loading brew...</p>
      </div>
    );
  }

  return <AlchemyLab sharedBrew={sharedBrew} />;
}
