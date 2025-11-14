import { TransactionHistory, UserStats, ReferralStats, Achievement } from '@/types/user-stats';

const STORAGE_KEYS = {
  TRANSACTIONS: 'solfinder_transactions',
  USER_STATS: 'solfinder_user_stats',
  REFERRAL_STATS: 'solfinder_referral_stats',
  ACHIEVEMENTS: 'solfinder_achievements',
};

export class StorageService {
  // Transactions
  static saveTransaction(walletAddress: string, transaction: TransactionHistory): void {
    const key = `${STORAGE_KEYS.TRANSACTIONS}_${walletAddress}`;
    const transactions = this.getTransactions(walletAddress);
    transactions.unshift(transaction);
    localStorage.setItem(key, JSON.stringify(transactions));
    
    // Update user stats
    this.updateUserStats(walletAddress, transaction);
  }

  static getTransactions(walletAddress: string): TransactionHistory[] {
    const key = `${STORAGE_KEYS.TRANSACTIONS}_${walletAddress}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // User Stats
  static updateUserStats(walletAddress: string, transaction: TransactionHistory): void {
    const stats = this.getUserStats(walletAddress);
    
    const updatedStats: UserStats = {
      walletAddress,
      totalAccountsClosed: stats.totalAccountsClosed + transaction.accountsClosed,
      totalSolReclaimed: stats.totalSolReclaimed + transaction.solReclaimed,
      totalFeePaid: stats.totalFeePaid + transaction.fee,
      totalNetReceived: stats.totalNetReceived + transaction.netReceived,
      firstTransactionDate: stats.firstTransactionDate || transaction.timestamp,
      lastTransactionDate: transaction.timestamp,
      transactionCount: stats.transactionCount + 1,
      averageReclaimPerTransaction: 
        (stats.totalSolReclaimed + transaction.solReclaimed) / (stats.transactionCount + 1),
    };

    const key = `${STORAGE_KEYS.USER_STATS}_${walletAddress}`;
    localStorage.setItem(key, JSON.stringify(updatedStats));

    // Check achievements
    this.checkAchievements(walletAddress, updatedStats);
  }

  static getUserStats(walletAddress: string): UserStats {
    const key = `${STORAGE_KEYS.USER_STATS}_${walletAddress}`;
    const data = localStorage.getItem(key);
    
    if (data) return JSON.parse(data);
    
    return {
      walletAddress,
      totalAccountsClosed: 0,
      totalSolReclaimed: 0,
      totalFeePaid: 0,
      totalNetReceived: 0,
      firstTransactionDate: 0,
      lastTransactionDate: 0,
      transactionCount: 0,
      averageReclaimPerTransaction: 0,
    };
  }

  // Referral Stats
  static getReferralStats(walletAddress: string): ReferralStats {
    const key = `${STORAGE_KEYS.REFERRAL_STATS}_${walletAddress}`;
    const data = localStorage.getItem(key);
    
    if (data) return JSON.parse(data);
    
    const referralCode = walletAddress.slice(0, 8).toUpperCase();
    return {
      referralCode,
      totalReferrals: 0,
      totalReferralEarnings: 0,
      referredUsers: [],
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?ref=${referralCode}`,
    };
  }

  static updateReferralStats(
    referrerAddress: string, 
    referredAddress: string, 
    earnings: number
  ): void {
    const stats = this.getReferralStats(referrerAddress);
    
    const existingUser = stats.referredUsers.find(u => u.walletAddress === referredAddress);
    
    if (existingUser) {
      existingUser.totalEarned += earnings;
      existingUser.transactionCount += 1;
    } else {
      stats.referredUsers.push({
        walletAddress: referredAddress,
        timestamp: Date.now(),
        totalEarned: earnings,
        transactionCount: 1,
      });
      stats.totalReferrals += 1;
    }
    
    stats.totalReferralEarnings += earnings;
    
    const key = `${STORAGE_KEYS.REFERRAL_STATS}_${referrerAddress}`;
    localStorage.setItem(key, JSON.stringify(stats));
  }

  // Achievements
  static getAchievements(walletAddress: string): Achievement[] {
    const key = `${STORAGE_KEYS.ACHIEVEMENTS}_${walletAddress}`;
    const data = localStorage.getItem(key);
    
    if (data) return JSON.parse(data);
    
    return this.getDefaultAchievements();
  }

  static getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first_blood',
        name: 'First Blood',
        description: 'Close your first token account',
        icon: '🎯',
        unlocked: false,
        requirement: 1,
        progress: 0,
      },
      {
        id: 'getting_started',
        name: 'Getting Started',
        description: 'Close 10 token accounts',
        icon: '🚀',
        unlocked: false,
        requirement: 10,
        progress: 0,
      },
      {
        id: 'account_hunter',
        name: 'Account Hunter',
        description: 'Close 50 token accounts',
        icon: '🏹',
        unlocked: false,
        requirement: 50,
        progress: 0,
      },
      {
        id: 'sol_collector',
        name: 'SOL Collector',
        description: 'Reclaim 1 SOL in total',
        icon: '💎',
        unlocked: false,
        requirement: 1,
        progress: 0,
      },
      {
        id: 'whale',
        name: 'Whale',
        description: 'Reclaim 10 SOL in total',
        icon: '🐋',
        unlocked: false,
        requirement: 10,
        progress: 0,
      },
      {
        id: 'referral_starter',
        name: 'Referral Starter',
        description: 'Refer your first user',
        icon: '🤝',
        unlocked: false,
        requirement: 1,
        progress: 0,
      },
      {
        id: 'influencer',
        name: 'Influencer',
        description: 'Refer 10 users',
        icon: '⭐',
        unlocked: false,
        requirement: 10,
        progress: 0,
      },
    ];
  }

  static checkAchievements(walletAddress: string, stats: UserStats): void {
    const achievements = this.getAchievements(walletAddress);
    const referralStats = this.getReferralStats(walletAddress);
    let updated = false;

    achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      switch (achievement.id) {
        case 'first_blood':
        case 'getting_started':
        case 'account_hunter':
          achievement.progress = stats.totalAccountsClosed;
          break;
        case 'sol_collector':
        case 'whale':
          achievement.progress = stats.totalSolReclaimed;
          break;
        case 'referral_starter':
        case 'influencer':
          achievement.progress = referralStats.totalReferrals;
          break;
      }

      if (achievement.progress >= achievement.requirement) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        updated = true;
      }
    });

    if (updated) {
      const key = `${STORAGE_KEYS.ACHIEVEMENTS}_${walletAddress}`;
      localStorage.setItem(key, JSON.stringify(achievements));
    }
  }

  // Clear all data (for testing)
  static clearAllData(walletAddress: string): void {
    localStorage.removeItem(`${STORAGE_KEYS.TRANSACTIONS}_${walletAddress}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER_STATS}_${walletAddress}`);
    localStorage.removeItem(`${STORAGE_KEYS.REFERRAL_STATS}_${walletAddress}`);
    localStorage.removeItem(`${STORAGE_KEYS.ACHIEVEMENTS}_${walletAddress}`);
  }
}
