'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/lib/supabase/transactions';

interface LeaderboardUser {
  wallet_address: string;
  total_sol_reclaimed: number;
  total_accounts_closed: number;
  referral_earnings: number;
}

type LeaderboardType = 'sol' | 'accounts' | 'referrals';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('sol');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      const data = await getLeaderboard(10);
      setLeaderboard(data || []);
      setLoading(false);
    }
    loadLeaderboard();

    // Refresh toutes les 30 secondes
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSortedLeaderboard = () => {
    const sorted = [...leaderboard];
    switch (activeTab) {
      case 'sol':
        return sorted.sort((a, b) => b.total_sol_reclaimed - a.total_sol_reclaimed);
      case 'accounts':
        return sorted.sort((a, b) => b.total_accounts_closed - a.total_accounts_closed);
      case 'referrals':
        return sorted.sort((a, b) => (b.referral_earnings || 0) - (a.referral_earnings || 0));
      default:
        return sorted;
    }
  };

  const formatWallet = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const getEmojiForRank = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const sortedData = getSortedLeaderboard();

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin text-6xl">⚡</div>
        <p className="text-gray-400 mt-4">Loading leaderboard...</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-4">No Data Yet</h2>
        <p className="text-gray-400">Be the first to appear on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-orbitron)] mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
            🏆 Leaderboard
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          Compete with others and see top performers globally
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('sol')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'sol'
              ? 'bg-neon-purple text-white'
              : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
          }`}
        >
          💎 Most SOL Reclaimed
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'accounts'
              ? 'bg-neon-purple text-white'
              : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
          }`}
        >
          🔒 Most Accounts Closed
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'referrals'
              ? 'bg-neon-purple text-white'
              : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
          }`}
        >
          ⭐ Most Referrals
        </button>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        {sortedData.map((user, index) => {
          const rank = index + 1;
          const value =
            activeTab === 'sol'
              ? user.total_sol_reclaimed.toFixed(4)
              : activeTab === 'accounts'
              ? user.total_accounts_closed.toString()
              : (user.referral_earnings || 0).toFixed(4);

          const label =
            activeTab === 'sol'
              ? 'SOL Reclaimed'
              : activeTab === 'accounts'
              ? 'Accounts Closed'
              : 'SOL Earned';

          return (
            <div
              key={user.wallet_address}
              className={`card-cyber flex items-center justify-between p-6 hover:scale-[1.02] transition-transform ${
                rank <= 3 ? 'border-2 border-neon-purple/50' : ''
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="text-5xl">{getEmojiForRank(rank)}</div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {rank <= 3 ? `User ${rank}` : `#${rank}`}
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    {formatWallet(user.wallet_address)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-3xl font-bold ${
                    activeTab === 'sol'
                      ? 'text-neon-purple'
                      : activeTab === 'accounts'
                      ? 'text-neon-pink'
                      : 'text-neon-cyan'
                  }`}
                >
                  {value}
                </div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live indicator */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Live Data from Supabase
        </span>
      </div>
    </div>
  );
}
