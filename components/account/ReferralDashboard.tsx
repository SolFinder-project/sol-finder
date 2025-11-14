'use client';

import { useReferral } from '@/hooks/useReferral';
import { useState } from 'react';

export default function ReferralDashboard() {
  const { referralCode, referralStats, getReferralLink } = useReferral();
  const [copied, setCopied] = useState(false);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!referralCode) return null;

  const referralPercentage = process.env.NEXT_PUBLIC_REFERRAL_FEE_PERCENTAGE || '10';

  return (
    <div className="card-cyber">
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
        🎁 Referral Program
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-bg rounded-lg p-4">
            <p className="text-sm text-gray-400">Total Referrals</p>
            <p className="text-2xl font-bold text-neon-purple">
              {referralStats?.totalReferrals || 0}
            </p>
          </div>
          <div className="bg-dark-bg rounded-lg p-4">
            <p className="text-sm text-gray-400">Total Earned</p>
            <p className="text-2xl font-bold text-neon-green">
              {(referralStats?.totalEarnings || 0).toFixed(6)} SOL
            </p>
          </div>
        </div>

        <div className="bg-dark-bg rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-dark-card px-4 py-2 rounded font-mono text-lg font-bold border border-dark-border">
              {referralCode}
            </code>
            <button
              onClick={copyReferralLink}
              className="btn-cyber"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-sm text-blue-300">
            💡 Earn {referralPercentage}% of every transaction made by users you refer!
          </p>
        </div>
      </div>
    </div>
  );
}
