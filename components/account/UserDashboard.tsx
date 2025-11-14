'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { StorageService } from '@/lib/utils/storage';
import { UserStats } from '@/types/user-stats';
import StatsCard from '@/components/ui/StatsCard';

export default function UserDashboard() {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (publicKey) {
      const userStats = StorageService.getUserStats(publicKey.toString());
      setStats(userStats);
    }
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="card-cyber text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <p className="text-xl text-gray-400">Connect your wallet to view your dashboard</p>
      </div>
    );
  }

  if (!stats || stats.transactionCount === 0) {
    return (
      <div className="card-cyber text-center py-12">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-2xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
            Start Your Journey
          </span>
        </h3>
        <p className="text-gray-400 mb-6">Close your first token account to see your stats here</p>
        <a href="#scanner" className="btn-cyber inline-block">
          Scan Now →
        </a>
      </div>
    );
  }

  const daysSinceFirst = Math.floor((Date.now() - stats.firstTransactionDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-cyber">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
                My Dashboard
              </span>
            </h2>
            <p className="text-gray-400 font-mono text-sm">
              Member since {new Date(stats.firstTransactionDate).toLocaleDateString()}
              {daysSinceFirst > 0 && ` (${daysSinceFirst} days ago)`}
            </p>
          </div>
          <div className="text-6xl animate-float">💎</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Accounts Closed"
          value={stats.totalAccountsClosed.toString()}
          icon="🔒"
          color="purple"
        />
        <StatsCard
          title="SOL Reclaimed"
          value={stats.totalSolReclaimed.toFixed(4)}
          icon="💰"
          color="pink"
        />
        <StatsCard
          title="Net Received"
          value={stats.totalNetReceived.toFixed(4)}
          icon="✨"
          color="cyan"
        />
        <StatsCard
          title="Transactions"
          value={stats.transactionCount.toString()}
          icon="⚡"
          color="green"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="card-cyber">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">💸</span>
            <span className="font-[family-name:var(--font-orbitron)]">Financial Overview</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 rounded-lg bg-dark-bg/50">
              <span className="text-gray-400">Total Reclaimed</span>
              <span className="font-bold text-neon-green font-mono">
                {stats.totalSolReclaimed.toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-dark-bg/50">
              <span className="text-gray-400">Service Fees Paid</span>
              <span className="font-bold text-orange-500 font-mono">
                {stats.totalFeePaid.toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-dark-bg/50">
              <span className="text-gray-400">Net Received</span>
              <span className="font-bold text-neon-cyan font-mono">
                {stats.totalNetReceived.toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30">
              <span className="text-gray-200 font-semibold">Avg per Transaction</span>
              <span className="font-bold text-white font-mono">
                {stats.averageReclaimPerTransaction.toFixed(6)} SOL
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="card-cyber">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            <span className="font-[family-name:var(--font-orbitron)]">Activity Summary</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 rounded-lg bg-dark-bg/50">
              <span className="text-gray-400">Total Transactions</span>
              <span className="font-bold text-neon-purple font-mono">
                {stats.transactionCount}
              </span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-dark-bg/50">
              <span className="text-gray-400">Accounts Closed</span>
              <span className="font-bold text-neon-pink font-mono">
                {stats.totalAccountsClosed}
              </span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-dark-bg/50">
              <span className="text-gray-400">First Transaction</span>
              <span className="font-bold text-gray-300 text-sm">
                {new Date(stats.firstTransactionDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-dark-bg/50">
              <span className="text-gray-400">Last Transaction</span>
              <span className="font-bold text-gray-300 text-sm">
                {new Date(stats.lastTransactionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to Next Milestone */}
      <div className="card-cyber border-neon-purple/30">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-2xl mr-2">🎯</span>
          <span className="font-[family-name:var(--font-orbitron)]">Your Progress</span>
        </h3>
        <div className="space-y-4">
          {/* SOL Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">SOL Reclaimed</span>
              <span className="text-neon-green font-mono">{stats.totalSolReclaimed.toFixed(2)} / 10.00 SOL</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.totalSolReclaimed / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Accounts Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Accounts Closed</span>
              <span className="text-neon-cyan font-mono">{stats.totalAccountsClosed} / 50</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.totalAccountsClosed / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
