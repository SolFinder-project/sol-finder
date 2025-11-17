'use client';

import { ScanResult } from '@/types/token-account';

interface ClaimSummaryProps {
  scanResult: ScanResult | null;
  selectedCount: number;
}

export default function ClaimSummary({ scanResult, selectedCount }: ClaimSummaryProps) {
  if (!scanResult) return null;

  const selectedReclaimable = (selectedCount * (scanResult.closeableAccounts[0]?.rentExemptReserve || 0)) / 1e9;
  const feePercentage = Number(process.env.NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE || 20);
  const selectedFee = (selectedReclaimable * feePercentage) / 100;
  const selectedNet = selectedReclaimable - selectedFee;

  return (
    <div className="card-cyber neon-border">
      <h3 className="text-2xl font-bold font-[family-name:var(--font-orbitron)] mb-6 text-glow">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
          Claim Summary
        </span>
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 rounded-lg bg-dark-bg/50">
          <span className="text-gray-400">Selected Accounts</span>
          <span className="font-bold text-xl font-mono text-neon-cyan">{selectedCount}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 rounded-lg bg-dark-bg/50">
          <span className="text-gray-400">Total Reclaimable</span>
          <span className="font-bold text-xl font-mono text-neon-green">
            {selectedReclaimable.toFixed(6)} SOL
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 rounded-lg bg-dark-bg/50">
          <span className="text-gray-400">Service Fee ({feePercentage}%)</span>
          <span className="font-bold text-xl font-mono text-orange-500">
            -{selectedFee.toFixed(6)} SOL
          </span>
        </div>
        
        <div className="pt-4 border-t-2 border-neon-purple/30">
          <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-pink/20">
            <span className="text-lg font-semibold text-gray-200">You Receive</span>
            <span className="text-3xl font-bold font-mono text-glow">
              {selectedNet.toFixed(6)} SOL
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center font-mono">
        💡 Service fee helps maintain and improve SOLcloser
      </p>
    </div>
  );
}
