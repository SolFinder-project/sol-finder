export interface ReferralData {
  referrer: string;
  code: string;
  timestamp: number;
}

export interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  referralCode: string;
}
