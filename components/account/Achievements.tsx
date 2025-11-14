'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { StorageService } from '@/lib/utils/storage';
import { Achievement } from '@/types/user-stats';

export default function Achievements() {
  const { publicKey } = useWallet();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    if (publicKey) {
      loadAchievements();
    }
  }, [publicKey]);

  const loadAchievements = () => {
    if (!publicKey) return;
    const userAchievements = StorageService.getAchievements(publicKey.toString());
    setAchievements(userAchievements);
  };

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (!publicKey) {
    return (
      <div className="card-cyber text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <p className="text-xl text-gray-400">Connect your wallet to view achievements</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-cyber">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
                Achievements
              </span>
            </h2>
            <p className="text-gray-400 text-sm">
              {unlockedCount} / {totalCount} unlocked
            </p>
          </div>

          {/* Progress */}
          <div className="w-full md:w-64">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-neon-purple font-mono">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'unlocked', 'locked'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`card-cyber transition-all ${
              achievement.unlocked
                ? 'border-neon-purple/50 bg-gradient-to-br from-neon-purple/10 to-transparent'
                : 'opacity-60 hover:opacity-80'
            }`}
          >
            <div className="text-center">
              <div className={`text-6xl mb-4 ${achievement.unlocked ? 'animate-float' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)] ${
                achievement.unlocked ? 'text-neon-purple' : 'text-gray-400'
              }`}>
                {achievement.name}
              </h3>
              
              <p className="text-sm text-gray-400 mb-4">
                {achievement.description}
              </p>

              {achievement.unlocked ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/30 text-neon-green text-xs">
                  <span>✓</span>
                  <span>Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span className="font-mono">
                      {achievement.progress} / {achievement.requirement}
                    </span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-purple/50 to-neon-pink/50 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
