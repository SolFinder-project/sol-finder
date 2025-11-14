export interface TransactionHistory {
  id: string;
  signature: string;
  timestamp: number;
  accountsClosed: number;
  solReclaimed: number;
  fee: number;
  netReceived: number;
  referralEarned?: number;
}

export interface UserStats {
  walletAddress: string;
  totalAccountsClosed: number;
  totalSolReclaimed: number;
  totalFeePaid: number;
  totalNetReceived: number;
  firstTransactionDate: number;
  lastTransactionDate: number;
  transactionCount: number;
  averageReclaimPerTransaction: number;
}

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  totalReferralEarnings: number;
  referredUsers: ReferredUser[];
  referralLink: string;
}

export interface ReferredUser {
  walletAddress: string;
  timestamp: number;
  totalEarned: number;
  transactionCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  requirement: number;
  progress: number;
}

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  displayName: string;
  totalReclaimed: number;
  accountsClosed: number;
  referrals?: number;
}
